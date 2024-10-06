import 'neo4j-driver'
import { Neo4jGraph } from '@langchain/community/graphs/neo4j_graph'
import { TokenTextSplitter } from 'langchain/text_splitter'
import { ChatOpenAI } from '@langchain/openai'
import { LLMGraphTransformer } from '@langchain/community/experimental/graph_transformers/llm'
import { Document } from '@langchain/core/documents'
import "@mendable/firecrawl-js";
import { FireCrawlLoader } from "@langchain/community/document_loaders/web/firecrawl";

export default defineEventHandler(async (event: any) => {
  console.log('Starting event handler');
  const { crawlUrl } = await readBody(event) as { crawlUrl: string };
  console.log('Received crawlUrl:', crawlUrl);

  const urlRegex = /^https:\/\/osdr\.nasa\.gov\/bio\/repo\/data\/studies\/OSD-\d+$/;

  if (!urlRegex.test(crawlUrl)) {
    console.log('Invalid OSD URL format');
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid OSD URL format',
    });
  }

  console.log('Initializing environment variables');
  const url = process.env.NEO4J_URI ?? ''
  const username = process.env.NEO4J_USERNAME ?? ''
  const password = process.env.NEO4J_PASSWORD ?? ''
  const openAIApiKey = process.env.OPENAI_API_KEY ?? ''
  const modelName = 'gpt-4o-mini'

  console.log('Creating ChatOpenAI instance');
  const llm = new ChatOpenAI({
    temperature: 0,
    modelName,
    openAIApiKey
  })

  console.log('Initializing Neo4jGraph');
  const graph = await Neo4jGraph.initialize({ url, username, password })

  console.log('Creating FireCrawlLoader');
  const loader = new FireCrawlLoader({
    url: crawlUrl ?? '',
    apiKey: process.env.FIRECRAWL_API_KEY ?? '',
    mode: "scrape",
    params: {
      maxDepth: 2,
    },
  });

  console.log('Loading documents');
  const rawDocs = await loader.load()
  console.log(`Loaded ${rawDocs.length} raw documents`);

  console.log('Initializing text splitter');
  const textSplitter = new TokenTextSplitter({
    chunkSize: 512,
    chunkOverlap: 24
  })

  console.log('Processing documents');
  let documents = []
  for (let i = 0; i < rawDocs.length; i++) {
    const chunks = await textSplitter.splitText(rawDocs[i].pageContent)
    const processedDocs = chunks.map(
      (chunk, index) =>
        new Document({
          pageContent: chunk,
          metadata: {
            a: index + 1,
            ...rawDocs[i].metadata
          }
        })
    )
    documents.push(...processedDocs)
  }
  console.log(`Processed ${documents.length} documents`);

  console.log('Creating LLMGraphTransformer');
  const llmTransformer = new LLMGraphTransformer({ llm })

  console.log('Converting to graph documents');
  const graphDocuments = await llmTransformer.convertToGraphDocuments(documents)
  console.log(`Converted ${graphDocuments.length} graph documents`);

  console.log('Adding graph documents to Neo4j');
  await graph.addGraphDocuments(graphDocuments, {
    baseEntityLabel: true,
    includeSource: true
  })

  console.log('Completed adding graph documents');

  console.log('Closing Neo4j connection');
  await graph.close()

  console.log('Event handler completed');
})
