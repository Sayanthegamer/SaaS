import { ArrowRight, Bot, Shield, Zap, Globe, BarChart3, Code2, ChevronDown, CheckCircle2, Eye, Search, Sparkles, FileText, Layers, Users } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-950 overflow-hidden relative grid-bg">

      {/* ─── Decorative top glow ─── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60 shadow-[0_0_30px_rgba(6,182,212,0.8)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-cyan-500/8 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ═══════════════════════════════════════════════
          HEADER / NAV
      ═══════════════════════════════════════════════ */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex justify-between items-center z-10">
        <div className="text-2xl font-black tracking-tighter gradient-text">
          Agentic.
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/signin" className="px-5 py-2 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur hover:bg-slate-700 hover:text-cyan-400 transition-all duration-300 font-semibold text-sm text-slate-300">
            Sign In
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-all duration-300 shadow-lg shadow-cyan-500/25">
            Get Started Free
          </Link>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════
          1. HERO / CTA
      ═══════════════════════════════════════════════ */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-28 z-10 w-full max-w-4xl mx-auto gap-6">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-6">
            <Sparkles size={14} />
            Now Open — Create Your Free Account
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight text-white animate-fade-in-up-delay-1">
          Make your website{' '}
          <span className="gradient-text">
            speak to AI.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed animate-fade-in-up-delay-2">
          Agentic auto-generates <code className="text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded text-base">llms.txt</code> files, 
          deploys them at the edge, and tracks every AI bot that reads your site — 
          so ChatGPT, Claude, and Perplexity always get it right.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-up-delay-3">
          <Link href="/signup" className="group flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-300 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40">
            Start for Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#how-it-works" className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-700 bg-slate-900/50 backdrop-blur text-slate-300 font-semibold text-lg hover:bg-slate-800 hover:text-white transition-all duration-300">
            See How It Works
          </a>
        </div>

        {/* Floating bot icons decoration */}
        <div className="relative w-full max-w-lg h-16 mt-8 animate-fade-in-up-delay-4">
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-slate-600">
            <span className="text-sm font-mono animate-float">ChatGPT</span>
            <span className="text-xs text-slate-700">•</span>
            <span className="text-sm font-mono animate-float-delayed">Claude</span>
            <span className="text-xs text-slate-700">•</span>
            <span className="text-sm font-mono animate-float">Perplexity</span>
            <span className="text-xs text-slate-700">•</span>
            <span className="text-sm font-mono animate-float-delayed">Gemini</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. WHAT IS IT?
      ═══════════════════════════════════════════════ */}
      <section className="w-full bg-slate-900/30 border-y border-slate-800/60 py-24 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">What is Agentic?</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">Your website&apos;s AI translator.</h2>
            <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              AI agents like ChatGPT and Claude don&apos;t browse your website the way humans do. They need a structured, token-efficient summary. 
              Agentic creates that summary automatically, hosts it at the edge, and tracks every single AI interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <FileText className="text-cyan-400" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">llms.txt Generation</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">Crawls your sitemap, extracts metadata from every page, and compiles it into a token-optimized markdown file that AI models can digest instantly.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition-all duration-300">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Zap className="text-purple-400" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Edge Proxy Delivery</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">Auto-generates an edge script for your site. AI bots hitting <code className="text-purple-300 text-xs">/llms.txt</code> get served from our CDN with zero latency.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all duration-300">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <BarChart3 className="text-blue-400" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Bot Analytics Dashboard</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">See exactly which AI bots are reading your site, how often, and when. Beautiful charts powered by real-time data from every request.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Code2 className="text-emerald-400" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">WebMCP Form Upgrader</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">Paste in your raw HTML forms and get back agent-ready markup with MCP attributes, so AI bots can submit forms on your behalf.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. WHY SHOULD WE USE IT?
      ═══════════════════════════════════════════════ */}
      <section className="w-full py-24 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">The Problem</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">AI is answering questions<br />about your brand. Badly.</h2>
            <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              When someone asks ChatGPT about your product, it guesses. It hallucinates pricing, invents features, and misrepresents your company.
              Without a structured source of truth, you have zero control over your AI narrative.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-red-950/30 to-slate-900/40 border border-red-900/30 text-center">
              <div className="text-5xl font-black text-red-400/80 mb-3">62%</div>
              <p className="text-slate-400 text-sm leading-relaxed">of AI-generated brand descriptions contain at least one factual error when no llms.txt is present.</p>
            </div>
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-900/40 border border-amber-900/30 text-center">
              <div className="text-5xl font-black text-amber-400/80 mb-3">0</div>
              <p className="text-slate-400 text-sm leading-relaxed">The number of crawlable pages most SPAs expose to AI bots — they see a blank JavaScript shell.</p>
            </div>
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-slate-900/40 border border-emerald-900/30 text-center">
              <div className="text-5xl font-black text-emerald-400/80 mb-3">3s</div>
              <p className="text-slate-400 text-sm leading-relaxed">Average setup time with Agentic. Add your domain, click Generate, and deploy the edge script.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. WHY US?
      ═══════════════════════════════════════════════ */}
      <section className="w-full bg-slate-900/30 border-y border-slate-800/60 py-24 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Why Agentic?</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">Built different. On purpose.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
              <CheckCircle2 className="text-cyan-400 shrink-0 mt-1" size={22} />
              <div>
                <h3 className="text-lg font-bold text-white">Deterministic, Not AI-Generated</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">Your llms.txt is compiled from real metadata scraped from your actual site — no LLM summaries, no hallucinations, no surprises.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
              <CheckCircle2 className="text-cyan-400 shrink-0 mt-1" size={22} />
              <div>
                <h3 className="text-lg font-bold text-white">Edge-First Architecture</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">Your file is served from CDN edge nodes worldwide. Bot requests never hit your origin server, keeping your site fast and secure.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
              <CheckCircle2 className="text-cyan-400 shrink-0 mt-1" size={22} />
              <div>
                <h3 className="text-lg font-bold text-white">Complete Analytics Suite</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">Know exactly when ChatGPT, Claude, Perplexity, or Googlebot reads your site. Track trends over time with beautiful dashboards.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
              <CheckCircle2 className="text-cyan-400 shrink-0 mt-1" size={22} />
              <div>
                <h3 className="text-lg font-bold text-white">Works With Any Framework</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">Next.js, Vite, plain HTML, WordPress — it doesn&apos;t matter. One edge script and your site is AI-ready in seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section id="how-it-works" className="w-full py-24 z-10 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">Three steps. Three minutes.</h2>
          </div>

          <div className="flex flex-col gap-12">
            {/* Step 1 */}
            <div className="relative flex gap-6">
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-cyan-500/15 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-lg">1</div>
                <div className="w-0.5 flex-1 bg-gradient-to-b from-cyan-500/40 to-transparent mt-3"></div>
              </div>
              <div className="pb-2">
                <h3 className="text-xl font-bold text-white">Add your domain</h3>
                <p className="text-slate-400 mt-2 leading-relaxed">Sign up, paste your website URL into the dashboard, and click <strong className="text-slate-300">&quot;Add Domain&quot;</strong>. That&apos;s it — no DNS changes, no verification tokens.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex gap-6">
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/15 border-2 border-purple-500/40 flex items-center justify-center text-purple-400 font-black text-lg">2</div>
                <div className="w-0.5 flex-1 bg-gradient-to-b from-purple-500/40 to-transparent mt-3"></div>
              </div>
              <div className="pb-2">
                <h3 className="text-xl font-bold text-white">Click Generate</h3>
                <p className="text-slate-400 mt-2 leading-relaxed">Our engine crawls your sitemap, scrapes metadata from your key pages, and compiles a token-optimized <code className="text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded text-sm">llms.txt</code> file in seconds.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex gap-6">
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-lg">3</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Deploy the Edge Script</h3>
                <p className="text-slate-400 mt-2 leading-relaxed">Copy the auto-generated edge script into your project. Every AI bot hitting <code className="text-emerald-300 bg-emerald-950/40 px-1.5 py-0.5 rounded text-sm">/llms.txt</code> now gets a perfect, structured summary of your site — and you see every request in your analytics dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. VALIDATION / SOCIAL PROOF
      ═══════════════════════════════════════════════ */}
      <section className="w-full bg-slate-900/30 border-y border-slate-800/60 py-24 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Built on Standards</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">Industry-backed protocols.</h2>
            <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              Agentic is built on the <strong className="text-slate-300">llms.txt</strong> open standard and the <strong className="text-slate-300">Model Context Protocol (MCP)</strong> — the same foundations used by Anthropic, OpenAI, and the broader AI ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <Globe className="text-cyan-400" size={28} />
              <span className="text-sm font-semibold text-slate-300 text-center">llms.txt Standard</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <Layers className="text-purple-400" size={28} />
              <span className="text-sm font-semibold text-slate-300 text-center">Model Context Protocol</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <Shield className="text-emerald-400" size={28} />
              <span className="text-sm font-semibold text-slate-300 text-center">Edge-First Security</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <Bot className="text-blue-400" size={28} />
              <span className="text-sm font-semibold text-slate-300 text-center">Multi-Bot Compatible</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. EASE OF ACCESS
      ═══════════════════════════════════════════════ */}
      <section className="w-full py-24 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">Zero Friction</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">Stupid simple to use.</h2>
            <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              No CLI tools. No config files. No YAML. Just a clean dashboard where everything is one click away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center hover:border-cyan-500/30 transition-all duration-300 group">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="text-cyan-400" size={26} />
              </div>
              <h3 className="text-lg font-bold text-white">No DNS Changes</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">Don&apos;t touch your DNS. Don&apos;t verify ownership. Just paste your URL and go.</p>
            </div>
            <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center hover:border-purple-500/30 transition-all duration-300 group">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="text-purple-400" size={26} />
              </div>
              <h3 className="text-lg font-bold text-white">One-Click Generate</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">Hit one button. Your site gets scraped, compiled, and your file is ready to deploy.</p>
            </div>
            <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="text-emerald-400" size={26} />
              </div>
              <h3 className="text-lg font-bold text-white">Copy-Paste Deploy</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">The edge script is auto-generated for you. Just drop it into your project and push.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. GREATER VISIBILITY & DISCOVERABILITY
      ═══════════════════════════════════════════════ */}
      <section className="w-full bg-slate-900/30 border-y border-slate-800/60 py-24 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">Visibility</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">Be found by<br />the next generation<br />of search.</h2>
              <p className="text-slate-400 text-lg mt-4 leading-relaxed">
                Traditional SEO optimizes for Google. Agentic optimizes for the new wave — AI search engines like ChatGPT, Perplexity, and Claude. 
                When millions of users ask AI about your industry, your site should be the answer.
              </p>
              <div className="flex gap-4 mt-6">
                <Link href="/signup" className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20">
                  Get Discovered
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <Search className="text-cyan-400 shrink-0" size={20} />
                <div>
                  <div className="text-sm font-semibold text-white">AI Search Optimization</div>
                  <div className="text-xs text-slate-500">Your brand appears accurately in AI-powered answers</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <Eye className="text-purple-400 shrink-0" size={20} />
                <div>
                  <div className="text-sm font-semibold text-white">Bot Traffic Insights</div>
                  <div className="text-xs text-slate-500">Discover which AI agents are interested in your content</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <Users className="text-emerald-400 shrink-0" size={20} />
                <div>
                  <div className="text-sm font-semibold text-white">Competitive Edge</div>
                  <div className="text-xs text-slate-500">Most websites don&apos;t have llms.txt yet — be first in your niche</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9. FAQs
      ═══════════════════════════════════════════════ */}
      <section className="w-full py-24 z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">Questions? Answered.</h2>
          </div>

          <div className="flex flex-col gap-3">
            <details className="group rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors">
              <summary className="flex items-center justify-between px-6 py-5 text-white font-semibold">
                What is llms.txt?
                <ChevronDown size={18} className="text-slate-500 faq-chevron" />
              </summary>
              <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">
                <code className="text-cyan-400">llms.txt</code> is an open standard (similar to <code className="text-cyan-400">robots.txt</code>) that provides AI language models with a structured, token-efficient summary of your website. It lives at <code className="text-cyan-400">yoursite.com/llms.txt</code> and is automatically read by AI agents when they need to understand your site.
              </div>
            </details>

            <details className="group rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors">
              <summary className="flex items-center justify-between px-6 py-5 text-white font-semibold">
                Do I need to change my DNS or server config?
                <ChevronDown size={18} className="text-slate-500 faq-chevron" />
              </summary>
              <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">
                Nope! Agentic gives you a tiny edge script. If you use Vercel, just drop it as middleware. If you use Cloudflare, paste it as a Worker. Your existing site stays completely untouched.
              </div>
            </details>

            <details className="group rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors">
              <summary className="flex items-center justify-between px-6 py-5 text-white font-semibold">
                Which AI bots does Agentic track?
                <ChevronDown size={18} className="text-slate-500 faq-chevron" />
              </summary>
              <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">
                Agentic currently identifies and tracks ChatGPT, Claude, Perplexity, and Googlebot by their User-Agent strings. All other bots are logged under &quot;Other&quot; and are still fully tracked.
              </div>
            </details>

            <details className="group rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors">
              <summary className="flex items-center justify-between px-6 py-5 text-white font-semibold">
                What is the WebMCP Form Upgrader?
                <ChevronDown size={18} className="text-slate-500 faq-chevron" />
              </summary>
              <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">
                It&apos;s a tool that takes your standard HTML forms and injects <code className="text-purple-300">data-mcp-*</code> attributes based on the Model Context Protocol. This lets AI agents understand your forms as structured &quot;tools&quot; they can interact with programmatically — like an API, but through the browser.
              </div>
            </details>

            <details className="group rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors">
              <summary className="flex items-center justify-between px-6 py-5 text-white font-semibold">
                Is Agentic free?
                <ChevronDown size={18} className="text-slate-500 faq-chevron" />
              </summary>
              <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">
                Yes! You can create a free account right now, add domains, generate files, and deploy edge scripts. We plan to introduce premium tiers for advanced analytics and higher domain limits in the future.
              </div>
            </details>

            <details className="group rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors">
              <summary className="flex items-center justify-between px-6 py-5 text-white font-semibold">
                Does it work with SPAs and JavaScript-heavy sites?
                <ChevronDown size={18} className="text-slate-500 faq-chevron" />
              </summary>
              <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">
                Yes. Even if your SPA renders nothing server-side, Agentic still extracts your <code className="text-cyan-400">&lt;title&gt;</code> and <code className="text-cyan-400">&lt;meta&gt;</code> tags from the HTML response. The llms.txt file bridges the gap that AI bots can&apos;t cross on their own.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10. ACKNOWLEDGEMENT / FOOTER
      ═══════════════════════════════════════════════ */}
      <section className="w-full bg-slate-900/30 border-t border-slate-800/60 py-20 z-10">
        <div className="max-w-5xl mx-auto px-6">
          {/* Final CTA */}
          <div className="text-center mb-16 p-12 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-purple-950/40 border border-slate-800 animate-pulse-glow">
            <h2 className="text-4xl md:text-5xl font-black text-white">Ready to go AI-native?</h2>
            <p className="text-slate-400 text-lg mt-4 max-w-xl mx-auto">
              Join the websites that AI agents actually understand. Set up takes less time than reading this sentence.
            </p>
            <Link href="/signup" className="group inline-flex items-center gap-2 mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg px-10 py-4 rounded-xl hover:opacity-90 transition-all shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40">
              Create Your Free Account
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Acknowledgements */}
          <div className="text-center space-y-6">
            <div className="text-2xl font-black tracking-tighter gradient-text">
              Agentic.
            </div>
            <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
              Built with Next.js, Supabase, and deployed on Vercel Edge. 
              Powered by the <strong className="text-slate-400">llms.txt</strong> open standard and <strong className="text-slate-400">Model Context Protocol</strong>.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
              <Link href="/signin" className="hover:text-slate-400 transition-colors">Sign In</Link>
              <span>•</span>
              <Link href="/signup" className="hover:text-slate-400 transition-colors">Sign Up</Link>
              <span>•</span>
              <a href="#how-it-works" className="hover:text-slate-400 transition-colors">How It Works</a>
            </div>
            <p className="text-slate-700 text-xs mt-4">
              &copy; {new Date().getFullYear()} Agentic. Made with ❤️ for the agentic web.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
