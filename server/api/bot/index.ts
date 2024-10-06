import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export default defineEventHandler(async (event: any) => {
  const { message, message_history } = await readBody(event) as { message: string, message_history: { role: string, content: string }[] };

  const formattedMessages = message_history.map(msg => ({ role: msg.role, content: msg.content }));
  const promptMessages = [
    {
      role: "system",
      content: "You are an assistant for question-answering tasks, and you respond in markdown format."
    },
    ...formattedMessages,
    { role: "human", content: "{question}" },
  ];

  const prompt = ChatPromptTemplate.fromMessages(promptMessages);
  
  const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: .5 });

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  const stream = await chain.stream({
    question: message,
  });

  return sendStream(event, stream);
});
