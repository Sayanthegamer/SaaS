import { fetchSitemapUrls, scrapeMetadata, compileLlmsTxt } from './src/lib/scraper';

async function test() {
  try {
    const urls = await fetchSitemapUrls('https://circuitjs.vercel.app');
    console.log('URLs:', urls);
    const metadata = await scrapeMetadata(urls);
    console.log('Metadata:', metadata);
    const { markdown, tokenCount } = compileLlmsTxt('circuitjs.vercel.app', metadata);
    console.log('Token count:', tokenCount);
  } catch (error) {
    console.error('Test failed:', error);
  }
}
test();
