import { XMLParser } from 'fast-xml-parser';
import { parse } from 'node-html-parser';
import { countTokens } from './tokenizer';

export interface PageMetadata {
  url: string;
  title: string;
  description: string;
  headings?: string[];
  features?: string[];
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

      // Extract headings (h2, h3)
      const headings = root.querySelectorAll('h2, h3')
        .map(h => h.text.trim())
        .filter(t => t.length > 5 && t.length < 80)
        .slice(0, 4);

      // Extract lists (li) as highlights/features
      const features: string[] = [];
      root.querySelectorAll('li').forEach(li => {
        const text = li.text.trim();
        if (text.length > 10 && text.length < 100 && features.length < 3) {
          features.push(text);
        }
      });

      // SPA fallback skipped to prevent Vercel bundle bloat (local Puppeteer is not supported on Vercel Serverless).
      if ((root.querySelector('body')?.text || '').trim().length < 500) {
        console.warn('SPA detected for URL:', url, '- metadata might be incomplete.');
      }
      
      title = title || 'Untitled Page';
      description = description || 'No description provided.';
      
      return { 
        url, 
        title: title.trim(), 
        description: description.trim(),
        headings: headings.length > 0 ? headings : undefined,
        features: features.length > 0 ? features : undefined
      };
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
  
  const homepage = pages.find(p => p.url.endsWith('/') || p.url.split('/').length === 3);
  if (homepage && homepage.description && homepage.description !== 'No description provided.') {
    markdown += `## Overview\n${homepage.description}\n\n`;
  }

  markdown += `## Structure and Pages\n\n`;
  
  for (const page of pages) {
    let path = '/';
    try {
      const parsedUrl = new URL(page.url);
      path = parsedUrl.pathname;
    } catch (_) {}

    let entry = `- [${page.title}](${page.url}) \`${path}\`\n`;
    if (page.description && page.description !== 'No description provided.') {
      entry += `  - **Overview**: ${page.description}\n`;
    }
    
    if (page.headings && page.headings.length > 0) {
      entry += `  - **Key Sections**:\n`;
      for (const h of page.headings) {
        entry += `    - ${h}\n`;
      }
    }
    
    if (page.features && page.features.length > 0) {
      entry += `  - **Highlights**:\n`;
      for (const f of page.features) {
        entry += `    - ${f}\n`;
      }
    }
    entry += `\n`;
    
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
