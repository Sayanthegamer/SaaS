import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '600', '900'] });

export const metadata: Metadata = {
  title: 'Agentic Web Infrastructure | Optimize for AI',
  description: 'Deploy deterministic llms.txt files and WebMCP schemas to guarantee your enterprise is correctly ingested by AI Agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.className} bg-slate-950 text-slate-200 antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}>
        {children}
      </body>
    </html>
  );
}
