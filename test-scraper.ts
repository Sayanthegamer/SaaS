import { fetchSitemapUrls, scrapeMetadata, compileLlmsTxt } from './src/lib/scraper';
import { parse } from 'node-html-parser';

const MOCK_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Acme Developer Platform</title>
  <meta name="description" content="The standard developer platform for AI agent integrations.">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Acme API Proxy",
    "description": "Seamless edge routing for all your API requests.",
    "offers": {
      "@type": "Offer",
      "price": "19.00",
      "priceCurrency": "USD"
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does pricing work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pricing is flat rate $19/mo per active routing domain."
        }
      },
      {
        "@type": "Question",
        "name": "Can I deploy on Vercel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we support Next.js Middleware and Vercel Redirects natively."
        }
      }
    ]
  }
  </script>
</head>
<body>
  <h1>Acme Developer Platform</h1>
  <p>Acme Developer Platform helps engineers build and deploy software faster. With our edge networks, we support globally fast redirects and analytics tracking.</p>
  <p>This is the second paragraph containing details about how easy it is to use our CLI tools to publish websites.</p>
  
  <h2>Pricing Plans</h2>
  <table>
    <thead>
      <tr>
        <th>Plan</th>
        <th>Price</th>
        <th>Requests</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Hobby</td>
        <td>Free</td>
        <td>10k/mo</td>
      </tr>
      <tr>
        <td>Pro</td>
        <td>$19/mo</td>
        <td>1M/mo</td>
      </tr>
    </tbody>
  </table>

  <h2>Follow Us</h2>
  <ul>
    <li><a href="https://github.com/acme/platform">GitHub Repository</a></li>
    <li><a href="https://discord.gg/acme">Join Discord Community</a></li>
    <li><a href="https://twitter.com/acme">Follow us on Twitter</a></li>
  </ul>
</body>
</html>
`;

// Direct function to mock scrape
async function testMock() {
  console.log('--- STARTING MOCK SCRAPING TEST ---');
  // We mock a simple version of the fetching in scrapeMetadata locally:
  const root = parse(MOCK_HTML);
  
  // Test our specific scraper logic extracts correctly
  // We can duplicate the extraction logic block here to check it directly
  let title = root.querySelector('title')?.text || root.querySelector('h1')?.text || '';
  let description = root.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const headings = root.querySelectorAll('h1, h2, h3').map(h => h.text.trim()).slice(0, 8);
  
  const features: string[] = [];
  root.querySelectorAll('li').forEach(li => {
    features.push(li.text.trim());
  });

  const paragraphs: string[] = [];
  root.querySelectorAll('p').forEach(p => {
    paragraphs.push(p.text.trim());
  });

  const tables: string[] = [];
  root.querySelectorAll('table').forEach(table => {
    const rows = table.querySelectorAll('tr');
    const mdRows: string[][] = [];
    rows.forEach(row => {
      mdRows.push(row.querySelectorAll('th, td').map(c => c.text.trim()));
    });
    if (mdRows.length > 0) {
      const maxCols = Math.max(...mdRows.map(r => r.length));
      const formatRow = (cells: string[]) => {
        const padded = [...cells, ...Array(maxCols - cells.length).fill('')];
        return `| ${padded.join(' | ')} |`;
      };
      let md = formatRow(mdRows[0]) + '\n';
      md += `| ${Array(maxCols).fill('---').join(' | ')} |\n`;
      mdRows.slice(1).forEach(row => {
        md += formatRow(row) + '\n';
      });
      tables.push(md.trim());
    }
  });

  const links: { text: string; url: string }[] = [];
  root.querySelectorAll('a').forEach(a => {
    links.push({ text: a.text.trim(), url: a.getAttribute('href') || '' });
  });

  const faqs: { question: string; answer: string }[] = [];
  let productInfo: any = undefined;

  root.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
    const json = JSON.parse(script.text.trim());
    const traverse = (obj: any) => {
      if (Array.isArray(obj)) {
        obj.forEach(traverse);
      } else if (typeof obj === 'object' && obj !== null) {
        if (obj['@type'] === 'FAQPage' && obj.mainEntity) {
          const entities = Array.isArray(obj.mainEntity) ? obj.mainEntity : [obj.mainEntity];
          entities.forEach((entity: any) => {
            faqs.push({
              question: entity.name || '',
              answer: (entity.acceptedAnswer?.text || '').trim()
            });
          });
        }
        if ((obj['@type'] === 'Product' || obj['@type'] === 'SoftwareApplication') && !productInfo) {
          productInfo = {
            name: obj.name || '',
            price: obj.offers?.price || '',
            currency: obj.offers?.priceCurrency || '',
            description: obj.description || ''
          };
        }
        for (const k in obj) {
          if (typeof obj[k] === 'object') traverse(obj[k]);
        }
      }
    };
    traverse(json);
  });

  const mockMeta = [{
    url: 'https://acme.sh/docs',
    title,
    description,
    headings,
    features,
    paragraphs,
    tables,
    links,
    faqs,
    productInfo
  }];

  const { markdown, tokenCount } = compileLlmsTxt('acme.sh', mockMeta);
  console.log(markdown);
  console.log('Token count:', tokenCount);
}

testMock();
