import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

export default defineEventHandler(async (event: any) => {
  const { message, rerankedDocs, message_history } = await readBody(event) as { message: string, rerankedDocs: any[], message_history: { role: string, content: string }[] };

  const formattedMessages = message_history.map(msg => ({ role: msg.role, content: msg.content }));
  const promptMessages = [
    {
      role: "system",
      content: "You are an assistant for question-answering tasks, and you respond in markdown format. Use the provided context to answer the question. If you don't know the complete answer, simply state that you don't know and tell the user to look into the appended files.\n\n**Context**:\n\n{context}\n\n"
    },
    ...formattedMessages,
    { role: "human", content: "{question}" },
  ];

  const prompt = ChatPromptTemplate.fromMessages(promptMessages);
  
  const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt,
    outputParser: new StringOutputParser(),
  });

  const stream = await ragChain.stream({
    context: rerankedDocs,
    question: message,
  });

  return sendStream(event, stream);
});
