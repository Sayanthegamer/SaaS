import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '600', '900'] });

export const metadata: Metadata = {
  title: 'LLMify | Optimize Your Website for AI Agents & LLMs',
  description: 'Deploy deterministic llms.txt files and WebMCP schemas to guarantee your website is correctly understood, crawled, and ingested by AI search engines like ChatGPT, Claude, and Perplexity.',
  keywords: [
    'llms.txt',
    'AI search optimization',
    'Generative Engine Optimization',
    'GEO',
    'Model Context Protocol',
    'WebMCP',
    'SEO for AI',
    'AI crawlers',
    'llms.txt generator'
  ],
  authors: [{ name: 'LLMify Team' }],
  metadataBase: new URL('https://saas-eta-rose.vercel.app'),
  openGraph: {
    title: 'LLMify | Optimize Your Website for AI Agents & LLMs',
    description: 'Deploy deterministic llms.txt files and WebMCP schemas to guarantee your website is correctly understood, crawled, and ingested by AI search engines.',
    url: 'https://saas-eta-rose.vercel.app',
    siteName: 'LLMify',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLMify | Optimize Your Website for AI Agents',
    description: 'Deploy deterministic llms.txt files and WebMCP schemas to guarantee your website is correctly understood by AI agents.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'LLMify',
    'description': 'Deploy deterministic llms.txt files and WebMCP schemas to guarantee your enterprise is correctly ingested by AI Agents.',
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'All',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfit.className} bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-800 selection:text-zinc-100`}>
        {children}
      </body>
    </html>
  );
}
