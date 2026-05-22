# Stage 2: Sitemap Parser & llms.txt Generator

This stage covers the core backend logic: reading a client domain's sitemap, scraping metadata from the top pages concurrently, compiling it into valid Markdown, strictly enforcing the 3,000 token limit, and saving the output to Supabase.

## 1. Domain & Sitemap Resolution

We need a utility to fetch a sitemap. Many websites use `domain.com/sitemap.xml`, but others might have a `sitemap_index.xml`.

### `lib/scraper.ts` - Step 1: Fetching
```typescript
import { XMLParser } from 'fast-xml-parser';

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
    
    // Handle standard <urlset>
    if (parsed.urlset && parsed.urlset.url) {
      const urlNodes = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
      urls = urlNodes.map((u: any) => u.loc);
    } 
    // Handle <sitemapindex>
    else if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
      // In a full production app, we would recursively fetch these indexes.
      // For MVP, we extract the first index's URLs.
      const sitemapNodes = Array.isArray(parsed.sitemapindex.sitemap) ? parsed.sitemapindex.sitemap : [parsed.sitemapindex.sitemap];
      return fetchSitemapUrls(sitemapNodes[0].loc);
    }

    // Limit to top 20 URLs to avoid lambda timeout and massive token usage
    return urls.slice(0, 20);
  } catch (error) {
    console.error('Sitemap parsing failed:', error);
    return [domainUrl]; // Fallback to just the homepage if sitemap fails
  }
}
```

## 2. HTML Metadata Extraction

For each extracted URL, we need to fetch the HTML and extract the `<title>` and `<meta name="description">`.

### `lib/scraper.ts` - Step 2: Cheerio Parsing
```typescript
import * as cheerio from 'cheerio';

export interface PageMetadata {
  url: string;
  title: string;
  description: string;
}

export async function scrapeMetadata(urls: string[]): Promise<PageMetadata[]> {
  // Concurrently fetch all URLs for maximum performance
  const fetchPromises = urls.map(async (url) => {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Agentic-SEO-Bot/1.0' } });
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const title = $('title').text() || $('h1').first().text() || 'Untitled Page';
      const description = $('meta[name="description"]').attr('content') || 'No description provided.';
      
      return { url, title: title.trim(), description: description.trim() };
    } catch (e) {
      return null;
    }
  });

  const results = await Promise.all(fetchPromises);
  return results.filter((res) => res !== null) as PageMetadata[];
}
```

## 3. Tokenizer and Markdown Compilation

The `llms.txt` file must be under 3,000 tokens to be fully ingested by models like ChatGPT or Claude.

### `lib/tokenizer.ts`
```typescript
import { encode } from 'tiktoken';

export function countTokens(text: string): number {
  // Using standard cl100k_base encoding used by OpenAI models
  const tokens = encode(text);
  return tokens.length;
}
```

### `lib/scraper.ts` - Step 3: Markdown Generation
```typescript
import { countTokens } from './tokenizer';

export function compileLlmsTxt(domainName: string, pages: PageMetadata[]): { markdown: string, tokenCount: number } {
  let markdown = `# ${domainName}\n\n`;
  markdown += `> This is the official llms.txt file for ${domainName}, outlining key pages and context for AI agents.\n\n`;
  markdown += `## Structure and Pages\n\n`;
  
  for (const page of pages) {
    const entry = `- [${page.title}](${page.url}): ${page.description}\n`;
    
    // Strict token check before appending
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
```

## 4. The API Route Integration

This route wires everything together: handles Next.js authentication, runs the scraping logic, and inserts the result into Supabase.

### `app/api/generate-llms/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchSitemapUrls, scrapeMetadata, compileLlmsTxt } from '@/lib/scraper';

export async function POST(request: Request) {
  const supabase = createClient();
  
  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { domainId, domainUrl } = await request.json();
  if (!domainId || !domainUrl) {
    return NextResponse.json({ error: 'Missing domain parameters' }, { status: 400 });
  }

  try {
    // 2. Update status to 'active' indicating processing has started
    await supabase.from('domains').update({ status: 'active' }).eq('id', domainId);

    // 3. Scrape and generate the data
    const urls = await fetchSitemapUrls(domainUrl);
    const metadata = await scrapeMetadata(urls);
    const domainName = new URL(domainUrl).hostname;
    
    const { markdown, tokenCount } = compileLlmsTxt(domainName, metadata);

    // 4. Save the generated Markdown to Supabase (upsert handles updates if domain_id exists)
    const { error: dbError } = await supabase.from('llms_files').upsert({
      domain_id: domainId,
      content: markdown,
      token_count: tokenCount,
      last_updated: new Date().toISOString()
    }, { onConflict: 'domain_id' });

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, tokenCount });

  } catch (error: any) {
    console.error('Generation failed:', error);
    await supabase.from('domains').update({ status: 'failed' }).eq('id', domainId);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

## Next Steps
Once Stage 2 is verified, we will move to **Stage 3: The Edge Reverse Proxy (Cloudflare Worker)** which is the system that will serve this generated markdown from Supabase to AI agents visiting the client's actual domain.
