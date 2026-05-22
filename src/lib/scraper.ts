import { XMLParser } from 'fast-xml-parser';
import { parse } from 'node-html-parser';
import { countTokens } from './tokenizer';

export interface PageMetadata {
  url: string;
  title: string;
  description: string;
}

export async function fetchSitemapUrls(domainUrl: string): Promise<string[]> {
  const sitemapUrl = new URL('/sitemap.xml', domainUrl).toString();
  
  try {
    const response = await fetch(sitemapUrl, { 
      headers: { 'User-Agent': 'Agentic-SEO-Bot/1.0' } 
    });
    
    if (!response.ok) throw new Error('Sitemap not found');
    
    const xmlText = await response.text();
    const parser = new XMLParser();
    const parsed = parser.parse(xmlText);
    
    let urls: string[] = [];
    
    if (parsed.urlset && parsed.urlset.url) {
      const urlNodes = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
      urls = urlNodes.map((u: any) => u.loc);
    } 
    else if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
      const sitemapNodes = Array.isArray(parsed.sitemapindex.sitemap) ? parsed.sitemapindex.sitemap : [parsed.sitemapindex.sitemap];
      return fetchSitemapUrls(sitemapNodes[0].loc);
    }

    return urls.slice(0, 20);
  } catch (error) {
    console.error('Sitemap parsing failed:', error);
    return [domainUrl];
  }
}

export async function scrapeMetadata(urls: string[]): Promise<PageMetadata[]> {
  // Stage 5 Hardening: Sort URLs heuristically to prioritize important pages
  const priorityKeywords = ['pricing', 'about', 'contact', 'features'];
  const sortedUrls = urls.sort((a, b) => {
    const aPriority = priorityKeywords.some(kw => a.toLowerCase().includes(kw)) ? 1 : 0;
    const bPriority = priorityKeywords.some(kw => b.toLowerCase().includes(kw)) ? 1 : 0;
    return bPriority - aPriority;
  });

  const fetchPromises = sortedUrls.map(async (url) => {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Agentic-SEO-Bot/1.0' } });
      const html = await res.text();
      const root = parse(html);
      
      let title = root.querySelector('title')?.text || root.querySelector('h1')?.text || '';
      let description = root.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      // SPA fallback skipped to prevent Vercel bundle bloat (local Puppeteer is not supported on Vercel Serverless).
      if ((root.querySelector('body')?.text || '').trim().length < 500) {
        console.warn('SPA detected for URL:', url, '- metadata might be incomplete.');
      }
      
      title = title || 'Untitled Page';
      description = description || 'No description provided.';
      
      return { url, title: title.trim(), description: description.trim() };
    } catch (e) {
      return null;
    }
  });

  const results = await Promise.all(fetchPromises);
  return results.filter((res) => res !== null) as PageMetadata[];
}

export function compileLlmsTxt(domainName: string, pages: PageMetadata[]): { markdown: string, tokenCount: number } {
  let markdown = `# ${domainName}\n\n`;
  markdown += `> This is the official llms.txt file for ${domainName}, outlining key pages and context for AI agents.\n\n`;
  markdown += `## Structure and Pages\n\n`;
  
  for (const page of pages) {
    const entry = `- [${page.title}](${page.url}): ${page.description}\n`;
    
    if (countTokens(markdown + entry) > 2800) {
      markdown += `\n> [!NOTE]\n> Some pages were truncated to remain within the token limit.`;
      break; 
    }
    markdown += entry;
  }
  
  return {
    markdown,
    tokenCount: countTokens(markdown)
  };
}
