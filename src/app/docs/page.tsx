'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, ArrowLeft, BookOpen, Code, Cpu, Globe, Server } from 'lucide-react';

type SectionId = 'introduction' | 'getting-started' | 'edge-integrations' | 'webmcp' | 'geo-best-practices';
type IntegrationTab = 'cloudflare' | 'nextjs' | 'vercel' | 'nginx';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('introduction');
  const [activeTab, setActiveTab] = useState<IntegrationTab>('cloudflare');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const cloudflareCode = `export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/llms.txt') {
      const response = await fetch('https://saas-eta-rose.vercel.app/api/serve-llms?domain=' + encodeURIComponent('yoursite.com'));
      if (response.ok) {
        return new Response(await response.text(), { 
          headers: { 'Content-Type': 'text/plain' } 
        });
      }
    }
    return fetch(request);
  }
}`;

  const nextjsCode = `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  if (url.pathname === '/llms.txt') {
    // Proxy request to CrlContxt edge server
    const host = request.headers.get('host') || 'yoursite.com'
    const targetUrl = \`https://saas-eta-rose.vercel.app/api/serve-llms?domain=\${encodeURIComponent(host)}\`
    try {
      const res = await fetch(targetUrl)
      if (res.ok) {
        return new NextResponse(await res.text(), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
      }
    } catch (e) {
      console.error('CrlContxt proxy failed:', e)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/llms.txt',
}`;

  const vercelCode = `{
  "rewrites": [
    {
      "source": "/llms.txt",
      "destination": "https://saas-eta-rose.vercel.app/api/serve-llms?domain=yoursite.com"
    }
  ]
}`;

  const nginxCode = `location /llms.txt {
    proxy_pass https://saas-eta-rose.vercel.app/api/serve-llms?domain=yoursite.com;
    proxy_set_header Host saas-eta-rose.vercel.app;
    proxy_ssl_server_name on;
    resolver 8.8.8.8;
}`;

  const webMcpExample = `<form 
  action="/api/subscribe" 
  method="POST"
  data-mcp-name="subscribeNewsletter"
  data-mcp-description="Subscribe a user to the weekly developer newsletter by their email"
>
  <input 
    type="email" 
    name="email" 
    required 
    placeholder="you@domain.com"
    data-mcp-description="The email address to subscribe"
  />
  <button type="submit">Subscribe</button>
</form>`;

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-zinc-100">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 border-b border-zinc-900/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-none">
                <circle cx="16" cy="16" r="10" stroke="#f4f4f5" strokeWidth="2.5" strokeDasharray="16 8" strokeLinecap="round" />
                <circle cx="16" cy="16" r="5" stroke="#a1a1aa" strokeWidth="2" strokeDasharray="8 4" strokeLinecap="round" />
                <circle cx="16" cy="16" r="1.5" fill="#ffffff" />
              </svg>
              <span className="text-sm font-bold text-white tracking-tight">crlcontxt</span>
            </Link>
            <span className="text-xs text-zinc-700">/</span>
            <span className="text-xs text-zinc-500 font-mono">docs</span>
          </div>
          <Link href="/dashboard" className="text-xs font-medium text-zinc-400 hover:text-white border border-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-900 transition-colors">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 flex gap-12">
        
        {/* SIDEBAR */}
        <aside className="hidden md:block w-52 shrink-0 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto">
          <p className="text-xs font-mono text-zinc-650 uppercase tracking-widest mb-4">Documentation</p>
          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'introduction', label: 'Introduction' },
              { id: 'getting-started', label: 'Getting Started' },
              { id: 'edge-integrations', label: 'Edge Proxy Guides' },
              { id: 'webmcp', label: 'WebMCP Forms' },
              { id: 'geo-best-practices', label: 'GEO Best Practices' },
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id as SectionId)}
                className={`text-left text-sm py-1.5 px-3 rounded-md transition-colors ${
                  activeSection === sec.id
                    ? 'bg-zinc-900 text-white font-medium'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/30'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 max-w-3xl flex flex-col gap-16">
          
          {/* INTRODUCTION */}
          <section id="introduction" className="scroll-mt-20">
            <div className="flex items-center gap-2 text-zinc-600 mb-2">
              <BookOpen size={16} />
              <span className="text-xs font-mono uppercase tracking-wider">Overview</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4">
              Introduction to CrlContxt
            </h1>
            <p className="text-sm text-zinc-450 leading-relaxed mb-4">
              CrlContxt is a developer platform designed for **Generative Engine Optimization (GEO)**. Traditional search engine optimization prepares sites for Google and Bing algorithms. In the age of AI search (such as ChatGPT, Claude, and Perplexity), you must prepare your site to be easily parsed and ingested by **AI Agents**.
            </p>
            <p className="text-sm text-zinc-450 leading-relaxed mb-6">
              AI scrapers struggle with client-side SPAs, complex markup, and large volumes of boilerplate. CrlContxt solves this by generating a standardized, token-optimized <code className="text-zinc-300 font-mono text-xs bg-zinc-900/80 px-1 py-0.5 rounded border border-zinc-800">llms.txt</code> file outlining your site sitemap, page features, and page details.
            </p>
            <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-lg">
              <h3 className="text-xs font-mono text-zinc-300 uppercase tracking-wider mb-1.5">Why CrlContxt?</h3>
              <ul className="text-xs text-zinc-500 list-disc list-inside space-y-1.5">
                <li>**Zero Hallucinations**: Gives LLMs accurate, factual data directly scraped from your pages.</li>
                <li>**Real-Time Analytics**: Monitor every single crawler interaction with full breakdown analytics.</li>
                <li>**Inline Customization**: Easily modify or expand the Markdown outline using our inline custom dashboard editor.</li>
              </ul>
            </div>
          </section>

          {/* GETTING STARTED */}
          <section id="getting-started" className="scroll-mt-20">
            <div className="flex items-center gap-2 text-zinc-600 mb-2">
              <Globe size={16} />
              <span className="text-xs font-mono uppercase tracking-wider">Step-by-step Guide</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-4">
              Getting Started
            </h2>
            <div className="flex flex-col gap-8 mt-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-xs font-mono text-zinc-400 shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Register Your Domain</h4>
                  <p className="text-xs text-zinc-550 leading-relaxed mt-1">
                    Enter your root site URL (e.g. <code className="text-zinc-400">https://yoursite.com</code>) in the CrlContxt Dashboard.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-xs font-mono text-zinc-400 shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Trigger Crawl & Compile</h4>
                  <p className="text-xs text-zinc-550 leading-relaxed mt-1">
                    Click **Generate**. Our crawler will look for your website&apos;s sitemap, extract headers (`h2`/`h3`) and content lists, and format a compact outline of your website.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-xs font-mono text-zinc-400 shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Customize Content</h4>
                  <p className="text-xs text-zinc-550 leading-relaxed mt-1">
                    Click **Edit llms.txt** next to your domain. Make manual customizations, expand context for specific features, check the live token count, and save changes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* EDGE INTEGRATIONS */}
          <section id="edge-integrations" className="scroll-mt-20">
            <div className="flex items-center gap-2 text-zinc-600 mb-2">
              <Server size={16} />
              <span className="text-xs font-mono uppercase tracking-wider">Edge Deployment</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-4">
              Edge Proxy Routing
            </h2>
            <p className="text-sm text-zinc-450 leading-relaxed mb-6">
              To host the generated <code className="text-zinc-300 font-mono text-xs bg-zinc-900/80 px-1 py-0.5 rounded border border-zinc-800">/llms.txt</code> file natively on your domain with **zero latency impact**, copy and deploy one of the config templates below:
            </p>

            {/* TAB LIST */}
            <div className="flex border-b border-zinc-900 mb-4 gap-1">
              {[
                { id: 'cloudflare', label: 'Cloudflare Worker' },
                { id: 'nextjs', label: 'Next.js Middleware' },
                { id: 'vercel', label: 'Vercel Rewrites' },
                { id: 'nginx', label: 'Nginx Configuration' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as IntegrationTab)}
                  className={`text-xs px-4 py-2 border-b-2 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'border-white text-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB PANELS */}
            <div className="relative bg-zinc-950 rounded-lg border border-zinc-850 p-4 font-mono text-xs text-zinc-300 overflow-hidden">
              <button
                onClick={() => {
                  const code = activeTab === 'cloudflare' ? cloudflareCode :
                               activeTab === 'nextjs' ? nextjsCode :
                               activeTab === 'vercel' ? vercelCode : nginxCode;
                  copyToClipboard(code, activeTab);
                }}
                className="absolute top-3 right-3 text-zinc-550 hover:text-zinc-200 transition-colors bg-zinc-900/50 p-1.5 rounded border border-zinc-800 flex items-center gap-1.5"
              >
                {copiedId === activeTab ? (
                  <>
                    <Check size={12} className="text-emerald-500" />
                    <span className="text-[10px] text-emerald-500 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span className="text-[10px] font-medium">Copy</span>
                  </>
                )}
              </button>

              <pre className="overflow-x-auto h-72 py-2 pr-10">
                <code>
                  {activeTab === 'cloudflare' && cloudflareCode}
                  {activeTab === 'nextjs' && nextjsCode}
                  {activeTab === 'vercel' && vercelCode}
                  {activeTab === 'nginx' && nginxCode}
                </code>
              </pre>
            </div>
            <p className="text-xs text-zinc-550 mt-2 leading-relaxed">
              *Note: Replace <code className="text-zinc-400">yoursite.com</code> in the code blocks above with your own production domain name.
            </p>
          </section>

          {/* WEBMCP */}
          <section id="webmcp" className="scroll-mt-20">
            <div className="flex items-center gap-2 text-zinc-600 mb-2">
              <Code size={16} />
              <span className="text-xs font-mono uppercase tracking-wider">MCP Protocol</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-4">
              WebMCP Attribute Form Upgrades
            </h2>
            <p className="text-sm text-zinc-450 leading-relaxed mb-4">
              WebMCP is a proposed extension of the Model Context Protocol that allows AI agents to directly interact with HTML forms on a site. By adding semantic metadata tags like `data-mcp-name` and `data-mcp-description` onto your form fields, the agent learns how to programmatically submit them.
            </p>
            <p className="text-sm text-zinc-450 leading-relaxed mb-6">
              Use the **WebMCP Page** in the dashboard to quickly paste standard HTML and generate fully-conforming WebMCP form structures:
            </p>

            <div className="relative bg-zinc-950 rounded-lg border border-zinc-850 p-4 font-mono text-xs text-zinc-300">
              <button
                onClick={() => copyToClipboard(webMcpExample, 'webmcp')}
                className="absolute top-3 right-3 text-zinc-550 hover:text-zinc-200 transition-colors bg-zinc-900/50 p-1.5 rounded border border-zinc-800 flex items-center gap-1.5"
              >
                {copiedId === 'webmcp' ? (
                  <>
                    <Check size={12} className="text-emerald-500" />
                    <span className="text-[10px] text-emerald-500 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span className="text-[10px] font-medium">Copy</span>
                  </>
                )}
              </button>
              <pre className="overflow-x-auto py-2 pr-10">
                <code>{webMcpExample}</code>
              </pre>
            </div>
          </section>

          {/* GEO BEST PRACTICES */}
          <section id="geo-best-practices" className="scroll-mt-20">
            <div className="flex items-center gap-2 text-zinc-600 mb-2">
              <Cpu size={16} />
              <span className="text-xs font-mono uppercase tracking-wider">AI Search SEO</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-4">
              GEO (Generative Engine Optimization) Best Practices
            </h2>
            <div className="flex flex-col gap-6 text-sm text-zinc-450 leading-relaxed">
              <div className="flex flex-col gap-1.5">
                <h4 className="font-semibold text-zinc-200">1. Keep it within the 3,000 token limit</h4>
                <p className="text-xs text-zinc-500">
                  Large Language Models have context budgets. Scrapers are built to skip or truncate extremely verbose outlines. Keep your main `llms.txt` under 3,000 tokens to ensure complete ingestion.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="font-semibold text-zinc-200">2. Define clear relative links</h4>
                <p className="text-xs text-zinc-500">
                  AI bots parse lists of links. Maintain clear link names and format them relative to the root (e.g. `- [API Docs](/docs/api)`).
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="font-semibold text-zinc-200">3. Write descriptive meta details</h4>
                <p className="text-xs text-zinc-500">
                  Include summaries for complicated products. Instead of just putting &quot;Billing Page&quot;, write a short sentence outlining your price ranges and tier details.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
