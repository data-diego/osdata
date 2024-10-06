import "@mendable/firecrawl-js";
import { FireCrawlLoader } from "@langchain/community/document_loaders/web/firecrawl";

export default defineEventHandler(async (event: any) => {
  const { url } = await readBody(event) as { url: string };
  const loader = new FireCrawlLoader({
    url,
    apiKey: process.env.FIRECRAWL_API_KEY ?? '',
    mode: "scrape",
    params: {
      maxDepth: 2,
    },
  });
  console.log('loader', loader);
  const docs = await loader.load();
  console.log('docs', docs);
  return docs;
})