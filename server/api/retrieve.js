import { z } from 'zod'
import 'neo4j-driver'
import { Neo4jGraph } from '@langchain/community/graphs/neo4j_graph'
import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { Neo4jVectorStore } from '@langchain/community/vectorstores/neo4j_vector'
import { OpenAIEmbeddings } from '@langchain/openai'
import {
  RunnablePassthrough,
  RunnableSequence
} from '@langchain/core/runnables'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { generateFullTextQuery } from '../utils.js'

export default defineEventHandler(async (event) => {
  const { message } = await readBody(event);
  
  const stream = new ReadableStream({
    async start(controller) {
      const logAndStream = (message) => {
        console.log(message);
        controller.enqueue(message + '\n\n');
      };

      logAndStream('Received message: ' + message);

      const url = process.env.NEO4J_URI ?? ''
      const username = process.env.NEO4J_USERNAME ?? ''
      const password = process.env.NEO4J_PASSWORD ?? ''
      const openAIApiKey = process.env.OPENAI_API_KEY ?? ''
      const modelName = 'gpt-4o-mini'

      logAndStream('Initializing ChatOpenAI');
      const llm = new ChatOpenAI({
        temperature: 0,
        modelName,
        openAIApiKey
      })

      logAndStream('Initializing Neo4jGraph');
      const graph = await Neo4jGraph.initialize({ url, username, password })

      logAndStream('Initializing Neo4jVectorStore');
      const neo4jVectorIndex = await Neo4jVectorStore.fromExistingGraph(
        new OpenAIEmbeddings({ openAIApiKey }),
        {
          url,
          username,
          password,
          searchType: 'hybrid',
          nodeLabel: 'Document',
          textNodeProperties: ['text'],
          embeddingNodeProperty: 'embedding'
        }
      )

      const entitiesSchema = z
        .object({
          names: z
            .array(z.string())
            .describe(
              "Extract all entities from the text, including people, organizations, research institutions, universities, conferences, scientific journals, and other relevant scientific bodies."
            )
        })
        .describe('Identifying information about entities.')

      logAndStream('Creating entity chain');
      const structuredLlm = llm.withStructuredOutput(entitiesSchema);
      logAndStream('Creating fulltext index');
      await graph.query(
        'CREATE FULLTEXT INDEX entity IF NOT EXISTS FOR (e:__Entity__) ON EACH [e.id]'
      )

      async function structuredRetriever(question) {
        logAndStream('structuredRetriever called with question: ' + question);
        let result = ''
        const entities = await structuredLlm.invoke(question)
        logAndStream('Extracted entities: ' + entities.names);

        for (const entity of entities.names) {
          logAndStream('Processing entity: ' + entity);
          const response = await graph.query(
            `CALL db.index.fulltext.queryNodes('entity', $query, {limit:2})
            YIELD node,score
            CALL {
              MATCH (node)-[r:!MENTIONS]->(neighbor)
              RETURN node.id + ' - ' + type(r) + ' -> ' + neighbor.id AS output
              UNION
              MATCH (node)<-[r:!MENTIONS]-(neighbor)
              RETURN neighbor.id + ' - ' + type(r) + ' -> ' +  node.id AS output
            }
            RETURN output LIMIT 50`,
            { query: generateFullTextQuery(entity) }
          )

          result += response.map(el => el.output).join('\n') + '\n'
        }

        logAndStream('structuredRetriever result: ' + result);
        return result
      }

      async function retriever(question) {
        logAndStream('retriever called with question: ' + question);
        const structuredData = await structuredRetriever(question)

        logAndStream('Performing similarity search');
        const similaritySearchResults =
          await neo4jVectorIndex.similaritySearch(question, 1)
        const unstructuredData = similaritySearchResults.map(el => el.pageContent)

        const finalData = `Structured data:
        ${structuredData}
        Unstructured data:
        ${unstructuredData.map(content => `#Document ${content}`).join('\n')}
            `
        logAndStream('retriever finalData: ' + finalData);
        return finalData
      }

      const standaloneTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
      Follow Up Input: {question}
      Standalone question:`

      const answerTemplate = `You are a helpful and enthusiastic support bot who can answer any question based on the context provided. Try to find the answer in the context. If you really don't know the answer.

      context:{context}
      question: {question}
      answer:`

      const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)
      const standalonePrompt = PromptTemplate.fromTemplate(standaloneTemplate)

      const standaloneQuestionChain = standalonePrompt
        .pipe(llm)
        .pipe(new StringOutputParser())

      const retrieverChain = RunnableSequence.from([
        prevResult => {
          logAndStream('Retriever input: ' + prevResult.standaloneQuestion);
          return prevResult.standaloneQuestion
        },
        retriever
      ])

      const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser())

      const chain = RunnableSequence.from([
        {
          standaloneQuestion: async (input) => {
            const result = await standaloneQuestionChain.invoke(input)
            logAndStream('Standalone question: ' + result);
            return result
          },
          orignalInput: new RunnablePassthrough()
        },
        async (input) => {
          logAndStream('Retriever chain input: ' + JSON.stringify(input));
          const context = await retrieverChain.invoke(input)
          logAndStream('Retrieved context: ' + context);
          return {
            context,
            question: input.orignalInput.question,
            conversationHistory: input.orignalInput.conversationHistory
          }
        },
        async (input) => {
          logAndStream('Answer chain input: ' + JSON.stringify(input));
          const answer = await answerChain.invoke(input)
          return answer
        }
      ])

      async function ask(question) {
        logAndStream(`Search Query - ${question}`);
        const answer = await chain.invoke({
          question
        })
        await graph.close()
        await neo4jVectorIndex.close()
        return answer
      }

      const finalAnswer = await ask(message);
      controller.enqueue('Final Answer: ' + finalAnswer);
      controller.close();
    }
  });

  return sendStream(event, stream);
})
