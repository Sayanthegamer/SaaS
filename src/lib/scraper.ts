import { XMLParser } from 'fast-xml-parser';
import { parse } from 'node-html-parser';
import { countTokens } from './tokenizer';

export interface PageMetadata {
  url: string;
  title: string;
  description: string;
  headings?: string[];
  features?: string[];
  paragraphs?: string[];
  tables?: string[];
  links?: { text: string; url: string }[];
  faqs?: { question: string; answer: string }[];
  productInfo?: { name?: string; price?: string; currency?: string; description?: string };
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
      urls = urlNodes.map((u: {loc: string}) => u.loc);
    } 
    else if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
      const sitemapNodes = Array.isArray(parsed.sitemapindex.sitemap) ? parsed.sitemapindex.sitemap : [parsed.sitemapindex.sitemap];

      // Fetch ALL nested sitemaps concurrently
      const nestedUrlsPromises = sitemapNodes.map((node: {loc: string}) => fetchSitemapUrls(node.loc));
      const nestedUrlsArrays = await Promise.all(nestedUrlsPromises);

      // Flatten the array of arrays
      urls = nestedUrlsArrays.flat();
    }

    return Array.from(new Set(urls)).slice(0, 50); // Remove duplicates and slice
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

  const results: PageMetadata[] = [];
  const CONCURRENCY_LIMIT = 5;

  // Pre-compile regexes for performance
  const regexWhitespace = /\s+/g;
  const regexFeaturesExclude = /home|pricing|docs|login|sign in|sign up|dashboard|register|privacy|terms/i;
  const regexParagraphsExclude = /cookie|privacy|copyright|rights reserved|agree/i;

  for (let i = 0; i < sortedUrls.length; i += CONCURRENCY_LIMIT) {
    const chunk = sortedUrls.slice(i, i + CONCURRENCY_LIMIT);

    const chunkPromises = chunk.map(async (url) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const safeUrl = new URL(url).toString();
        const res = await fetch(safeUrl, {
          headers: { 'User-Agent': 'Agentic-SEO-Bot/1.0' },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) return null;

        const html = await res.text();
        const root = parse(html);

        let title = root.querySelector('title')?.text || root.querySelector('h1')?.text || '';
        let description = root.querySelector('meta[name="description"]')?.getAttribute('content') ||
                          root.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                          root.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '';

        // Extract headings (h1, h2, h3) - up to 8 for detail
        const headings = root.querySelectorAll('h1, h2, h3')
          .slice(0, 15) // Limit initial selector
          .map(h => h.text.trim().replace(regexWhitespace, ' '))
          .filter(t => t.length > 5 && t.length < 100)
          .slice(0, 8);

        // Extract list items (li) - up to 6 detailed items
        const features: string[] = [];
        const lis = root.querySelectorAll('li');
        for (const li of lis) {
          if (features.length >= 6) break;
          const text = li.text.trim().replace(regexWhitespace, ' ');
          if (
            text.length > 15 &&
            text.length < 150 &&
            !features.includes(text) &&
            !regexFeaturesExclude.test(text)
          ) {
            features.push(text);
          }
        }

        // Extract paragraphs (paragraphs) - up to 3 descriptive paragraphs
        const paragraphs: string[] = [];
        const ps = root.querySelectorAll('p');
        for (const p of ps) {
          if (paragraphs.length >= 3) break;
          const text = p.text.trim().replace(regexWhitespace, ' ');
          if (
            text.length > 60 &&
            text.length < 350 &&
            !regexParagraphsExclude.test(text)
          ) {
            paragraphs.push(text);
          }
        }

        // Extract tables and convert to Markdown
        const tables: string[] = [];
        const domTables = root.querySelectorAll('table');
        for (const table of domTables) {
          if (tables.length >= 2) break;
          const rows = table.querySelectorAll('tr');
          if (rows.length === 0) continue;

          const mdRows: string[][] = [];
          rows.slice(0, 8).forEach(row => {
            const cells = row.querySelectorAll('th, td')
              .slice(0, 5)
              .map(c => c.text.trim().replace(regexWhitespace, ' '));
            if (cells.length > 0) {
              mdRows.push(cells);
            }
          });

          if (mdRows.length > 0) {
            const maxCols = Math.max(...mdRows.map(r => r.length));
            const formatRow = (cells: string[]) => {
              const padded = [...cells, ...Array(maxCols - cells.length).fill('')];
              return `| ${padded.join(' | ')} |`;
            };
            let markdownTable = formatRow(mdRows[0]) + '\n';
            markdownTable += `| ${Array(maxCols).fill('---').join(' | ')} |\n`;
            mdRows.slice(1).forEach(row => {
              markdownTable += formatRow(row) + '\n';
            });
            tables.push(markdownTable.trim());
          }
        }

        // Extract high-value outbound resource links
        const linksMap = new Map<string, string>();
        const allowedDomains = [
          'github.com', 'discord.gg', 'discord.com', 'twitter.com', 'x.com',
          'npmjs.com', 'pypi.org', 'youtube.com', 'chrome.google.com',
          'play.google.com', 'apps.apple.com'
        ];
        
        const domLinks = root.querySelectorAll('a').slice(0, 200); // Limit number of links processed
        for (const a of domLinks) {
          if (linksMap.size >= 8) break;
          const href = a.getAttribute('href')?.trim();
          const text = a.text.trim().replace(regexWhitespace, ' ');
          if (href && href.startsWith('http')) {
            try {
              const urlObj = new URL(href);
              const isHighValue = allowedDomains.some(d => urlObj.hostname.endsWith(d)) ||
                                  urlObj.hostname.startsWith('docs.') ||
                                  urlObj.hostname.startsWith('api.') ||
                                  urlObj.hostname.startsWith('blog.');

              if (isHighValue && !linksMap.has(href)) {
                linksMap.set(href, text || urlObj.hostname);
              }
            } catch {}
          }
        }
        const links = Array.from(linksMap.entries()).map(([url, text]) => ({ text, url }));

        // Extract JSON-LD Schema data
        const faqs: { question: string; answer: string }[] = [];
        let productInfo: Record<string, string> | undefined = undefined;

        root.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
          try {
            const json = JSON.parse(script.text.trim());
            
            const extractFaq = (obj: Record<string, unknown> | null) => {
              if (!obj) return;
              if (obj['@type'] === 'FAQPage' && obj.mainEntity) {
                const entities = Array.isArray(obj.mainEntity) ? obj.mainEntity : [obj.mainEntity];
                entities.forEach((entity: Record<string, unknown>) => {
                  if (entity['@type'] === 'Question') {
                    const question = typeof entity.name === 'string' ? entity.name : typeof entity.text === 'string' ? entity.text : '';
                    const answerEntity = entity.acceptedAnswer as Record<string, unknown> | undefined;
                    const answer = typeof answerEntity?.text === 'string' ? answerEntity.text : typeof answerEntity?.description === 'string' ? answerEntity.description : '';
                    if (question && answer && faqs.length < 5) {
                      faqs.push({
                        question: question.trim(),
                        answer: answer.replace(/<[a-zA-Z\/][^>]*>/g, '').trim()
                      });
                    }
                  }
                });
              }
            };

            const extractProduct = (obj: Record<string, unknown> | null) => {
              if (!obj) return;
              if ((obj['@type'] === 'Product' || obj['@type'] === 'SoftwareApplication') && !productInfo) {
                const name = typeof obj.name === 'string' ? obj.name : '';
                const desc = typeof obj.description === 'string' ? obj.description : '';
                let price = '';
                let currency = '';
                if (obj.offers) {
                  const offers = Array.isArray(obj.offers) ? obj.offers[0] : obj.offers;
                  price = offers.price || '';
                  currency = typeof offers.priceCurrency === 'string' ? offers.priceCurrency : '';
                }
                productInfo = {
                  name: name.trim(),
                  price: String(price).trim(),
                  currency: currency.trim(),
                  description: desc.trim()
                };
              }
            };

            const traverse = (obj: unknown) => {
              if (Array.isArray(obj)) {
                obj.forEach(traverse);
              } else if (typeof obj === 'object' && obj !== null) {
                extractFaq(obj as Record<string, unknown>);
                extractProduct(obj as Record<string, unknown>);
                for (const k in obj) {
                  if (typeof (obj as Record<string, unknown>)[k] === 'object') {
                    traverse((obj as Record<string, unknown>)[k]);
                  }
                }
              }
            };

            traverse(json);
          } catch {}
        });

        // SPA fallback warning
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
          features: features.length > 0 ? features : undefined,
          paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
          tables: tables.length > 0 ? tables : undefined,
          links: links.length > 0 ? links : undefined,
          faqs: faqs.length > 0 ? faqs : undefined,
          productInfo
        };
      } catch (e) {
        console.warn('Failed to scrape URL:', url, e);
        return null;
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults.filter(Boolean) as PageMetadata[]);

    // Optional delay between chunks to be polite
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
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
    } catch {}

    let entry = `- [${page.title}](${page.url}) \`${path}\`\n`;
    if (page.description && page.description !== 'No description provided.') {
      entry += `  - **Overview**: ${page.description}\n`;
    }
    
    if (page.productInfo && page.productInfo.name) {
      entry += `  - **Product Details**:\n`;
      entry += `    - Name: ${page.productInfo.name}\n`;
      if (page.productInfo.description) {
        entry += `    - Description: ${page.productInfo.description}\n`;
      }
      if (page.productInfo.price) {
        entry += `    - Price: ${page.productInfo.price} ${page.productInfo.currency || ''}\n`;
      }
    }

    if (page.paragraphs && page.paragraphs.length > 0) {
      entry += `  - **Key Content Summary**:\n`;
      for (const p of page.paragraphs) {
        entry += `    - ${p}\n`;
      }
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

    if (page.tables && page.tables.length > 0) {
      entry += `  - **Data Tables**:\n`;
      for (const table of page.tables) {
        const indentedTable = table.split('\n').map(line => `    ${line}`).join('\n');
        entry += `${indentedTable}\n`;
      }
    }

    if (page.faqs && page.faqs.length > 0) {
      entry += `  - **FAQ**:\n`;
      for (const faq of page.faqs) {
        entry += `    - **Q**: ${faq.question}\n`;
        entry += `      **A**: ${faq.answer}\n`;
      }
    }

    if (page.links && page.links.length > 0) {
      entry += `  - **External Links**:\n`;
      for (const link of page.links) {
        entry += `    - [${link.text}](${link.url})\n`;
      }
    }
    
    entry += `\n`;
    
    if (countTokens(markdown + entry) > 7500) {
      markdown += `\n> [!NOTE]\n> Some pages or details were truncated to remain within the 7,500 token limit.`;
      break; 
    }
    markdown += entry;
  }
  
  return {
    markdown,
    tokenCount: countTokens(markdown)
  };
}
