import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans overflow-x-hidden">

      {/* ═══ NAV ═══ */}
      <header className="fixed top-0 w-full z-50 border-b border-zinc-900/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-none">
              <circle cx="16" cy="16" r="10" stroke="#f4f4f5" strokeWidth="2.5" strokeDasharray="16 8" strokeLinecap="round" />
              <circle cx="16" cy="16" r="5" stroke="#a1a1aa" strokeWidth="2" strokeDasharray="8 4" strokeLinecap="round" />
              <circle cx="16" cy="16" r="1.5" fill="#ffffff" />
            </svg>
            <span className="text-sm font-bold text-white tracking-tight">crlcontxt</span>
          </Link>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors hidden sm:block">Features</a>
            <a href="#how-it-works" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors hidden sm:block">How it works</a>
            <a href="#faq" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors hidden sm:block">FAQ</a>
            <Link href="/docs" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">Docs</Link>
            <Link href="/signin" className="text-sm text-zinc-400 hover:text-white transition-colors">Log in</Link>
            <Link href="/signup" className="text-sm font-medium bg-white text-zinc-950 px-4 py-1.5 rounded-md hover:bg-zinc-200 active:scale-[0.98] transition-all">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* ═══ 1. HERO ═══ */}
      <section className="pt-40 pb-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-6 animate-in">
            AI-native web infrastructure
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white animate-in delay-1">
            Make your website
            <br />
            speak to AI
          </h1>
          <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto animate-in delay-2">
            CrlContxt generates structured <code className="text-zinc-300 font-mono text-sm bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800">llms.txt</code> files 
            from your site, deploys them at the edge, and shows you exactly which AI bots are reading your content.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center animate-in delay-3">
            <Link href="/signup" className="group inline-flex items-center justify-center gap-2 bg-white text-zinc-950 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-zinc-200 active:scale-[0.98] transition-all w-full sm:w-auto">
              Start for free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 text-sm font-medium text-zinc-400 px-6 py-3 rounded-lg border border-zinc-800 hover:bg-zinc-900 hover:text-zinc-200 active:scale-[0.99] transition-all w-full sm:w-auto">
              How it works
            </a>
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* ═══ 2. WHAT IS IT ═══ */}
      <section id="features" className="py-32 px-6 scroll-mt-14">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="max-w-2xl mb-20">
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-3">What is CrlContxt</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Your website&apos;s AI translator
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
              AI agents don&apos;t browse like humans. They need structured, token-efficient summaries. 
              CrlContxt creates them automatically and tracks every interaction.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScrollReveal delayClass="delay-100" className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-8 hover:border-zinc-800 hover:bg-zinc-900/50 transition-all duration-300 group">
              <div className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-4 group-hover:text-zinc-400 transition-colors">01</div>
              <h3 className="text-base font-semibold text-white mb-2">llms.txt generation</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Crawls your sitemap, extracts metadata from every page, and compiles it into a token-optimized markdown file AI models digest instantly.
              </p>
            </ScrollReveal>

            <ScrollReveal delayClass="delay-200" className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-8 hover:border-zinc-800 hover:bg-zinc-900/50 transition-all duration-300 group">
              <div className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-4 group-hover:text-zinc-400 transition-colors">02</div>
              <h3 className="text-base font-semibold text-white mb-2">Edge proxy delivery</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Auto-generates an edge script for your site. Bots hitting <code className="font-mono text-zinc-400">/llms.txt</code> get served from CDN with zero latency.
              </p>
            </ScrollReveal>

            <ScrollReveal delayClass="delay-300" className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-8 hover:border-zinc-800 hover:bg-zinc-900/50 transition-all duration-300 group">
              <div className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-4 group-hover:text-zinc-400 transition-colors">03</div>
              <h3 className="text-base font-semibold text-white mb-2">Bot analytics</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                See which AI bots read your site, how often, and when. Real-time dashboards with breakdowns by bot type and time series.
              </p>
            </ScrollReveal>

            <ScrollReveal delayClass="delay-400" className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-8 hover:border-zinc-800 hover:bg-zinc-900/50 transition-all duration-300 group">
              <div className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-4 group-hover:text-zinc-400 transition-colors">04</div>
              <h3 className="text-base font-semibold text-white mb-2">WebMCP form upgrader</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Paste your HTML forms, get back agent-ready markup with MCP attributes so AI bots can interact with your site programmatically.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* ═══ 3. WHY USE IT ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="max-w-2xl mb-20">
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-3">The problem</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              AI is talking about your brand. Incorrectly.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
              When someone asks ChatGPT about your product, it guesses. It hallucinates pricing, invents features, 
              and misrepresents your company. Without a structured source of truth, you have no control.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <ScrollReveal delayClass="delay-100" className="flex flex-col">
              <div className="text-6xl font-extrabold text-white stat-number mb-2">62%</div>
              <div className="text-sm text-zinc-500 leading-relaxed">
                of AI-generated brand descriptions contain factual errors when no llms.txt is present
              </div>
            </ScrollReveal>
            <ScrollReveal delayClass="delay-200" className="flex flex-col">
              <div className="text-6xl font-extrabold text-white stat-number mb-2">0</div>
              <div className="text-sm text-zinc-500 leading-relaxed">
                crawlable pages most SPAs expose to AI bots — they see a blank JavaScript shell
              </div>
            </ScrollReveal>
            <ScrollReveal delayClass="delay-300" className="flex flex-col">
              <div className="text-6xl font-extrabold text-white stat-number mb-2">3s</div>
              <div className="text-sm text-zinc-500 leading-relaxed">
                average setup time. Add domain, generate, deploy. That&apos;s it.
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* ═══ 4. WHY US ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="max-w-2xl mb-16">
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-3">Why CrlContxt</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Built differently
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16">
            <ScrollReveal delayClass="delay-100">
              <h3 className="text-sm font-semibold text-white mb-1.5 uppercase tracking-wider">Deterministic, not AI-generated</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Your llms.txt is compiled from real metadata scraped from your actual pages. No LLM summaries, no hallucinations, no surprises.
              </p>
            </ScrollReveal>
            <ScrollReveal delayClass="delay-200">
              <h3 className="text-sm font-semibold text-white mb-1.5 uppercase tracking-wider">Edge-first architecture</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Files served from CDN edge nodes worldwide. Bot requests never touch your origin server, keeping your site fast and secure.
              </p>
            </ScrollReveal>
            <ScrollReveal delayClass="delay-300">
              <h3 className="text-sm font-semibold text-white mb-1.5 uppercase tracking-wider">Full analytics suite</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Know when ChatGPT, Claude, Perplexity, or Googlebot reads your site. Track trends over time with clean, real-time charts.
              </p>
            </ScrollReveal>
            <ScrollReveal delayClass="delay-400">
              <h3 className="text-sm font-semibold text-white mb-1.5 uppercase tracking-wider">Works with any framework</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Next.js, Vite, plain HTML, WordPress. One edge script and your site is AI-ready in seconds.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* ═══ 5. HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-32 px-6 scroll-mt-14">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal className="mb-20">
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-3">How it works</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Three steps. Three minutes.
            </h2>
          </ScrollReveal>

          <div className="flex flex-col gap-16">
            <ScrollReveal delayClass="delay-100" className="flex gap-8">
              <div className="shrink-0 w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-sm font-bold text-zinc-400">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Add your domain</h3>
                <p className="text-zinc-500 leading-relaxed">
                  Sign up, paste your URL, click &quot;Add Domain.&quot; No DNS changes, no verification tokens, no waiting.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delayClass="delay-200" className="flex gap-8">
              <div className="shrink-0 w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-sm font-bold text-zinc-400">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Click generate</h3>
                <p className="text-zinc-500 leading-relaxed">
                  Our engine crawls your sitemap, scrapes metadata from your key pages, and compiles a token-optimized <code className="font-mono text-zinc-400 bg-zinc-900 px-1 rounded">llms.txt</code> file in seconds.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delayClass="delay-300" className="flex gap-8">
              <div className="shrink-0 w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-sm font-bold text-zinc-400">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Deploy the edge script</h3>
                <p className="text-zinc-500 leading-relaxed">
                  Copy the auto-generated script into your project. Every AI bot hitting <code className="font-mono text-zinc-400 bg-zinc-900 px-1 rounded">/llms.txt</code> now gets a structured summary — and you see every request in analytics.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* ═══ 6. VALIDATION ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-3">Built on standards</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              Industry-backed protocols
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-16">
              CrlContxt implements the <strong className="text-zinc-200">llms.txt</strong> open standard 
              and <strong className="text-zinc-200">Model Context Protocol</strong> — the same foundations 
              adopted by Anthropic, OpenAI, and the broader AI ecosystem.
            </p>
          </ScrollReveal>

          <ScrollReveal delayClass="delay-100" className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-zinc-800 transition-colors">
              <span className="text-sm font-semibold text-zinc-300">llms.txt</span>
              <span className="text-xs text-zinc-600">Open Standard</span>
            </div>
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-zinc-800 transition-colors">
              <span className="text-sm font-semibold text-zinc-300">MCP</span>
              <span className="text-xs text-zinc-600">Context Protocol</span>
            </div>
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-zinc-800 transition-colors">
              <span className="text-sm font-semibold text-zinc-300">Edge CDN</span>
              <span className="text-xs text-zinc-600">Global Delivery</span>
            </div>
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-zinc-800 transition-colors">
              <span className="text-sm font-semibold text-zinc-300">Multi-Bot</span>
              <span className="text-xs text-zinc-600">Compatible</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="gradient-line" />

      {/* ═══ 7. EASE OF ACCESS ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-3">Zero friction</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              No config files. No CLI. No YAML.
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Just a clean dashboard where everything is one click away. 
              Add your domain, generate, deploy — done.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="gradient-line" />

      {/* ═══ 8. VISIBILITY ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-3">Discoverability</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                Be found by the next generation of search
              </h2>
              <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
                Traditional SEO optimizes for Google. CrlContxt optimizes for AI search — ChatGPT, Perplexity, Claude. 
                When users ask AI about your industry, your site should be the answer.
              </p>
              <Link href="/signup" className="group inline-flex items-center gap-2 mt-8 text-sm font-semibold text-white hover:text-zinc-300 transition-colors">
                Get discovered
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </ScrollReveal>

            <ScrollReveal className="flex flex-col gap-2">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 transition-colors">
                <div className="w-2 h-2 rounded-full bg-zinc-300 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-zinc-200">AI search optimization</div>
                  <div className="text-xs text-zinc-600">Your brand appears accurately in AI answers</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 transition-colors">
                <div className="w-2 h-2 rounded-full bg-zinc-500 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-zinc-200">Bot traffic insights</div>
                  <div className="text-xs text-zinc-600">Discover which AI agents are reading your content</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 transition-colors">
                <div className="w-2 h-2 rounded-full bg-zinc-700 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-zinc-200">Competitive edge</div>
                  <div className="text-xs text-zinc-600">Most sites don&apos;t have llms.txt yet — be first</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* ═══ 9. FAQ ═══ */}
      <section id="faq" className="py-32 px-6 scroll-mt-14">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal className="mb-16">
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-3">FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Common questions
            </h2>
          </ScrollReveal>

          <ScrollReveal delayClass="delay-100" className="flex flex-col divide-y divide-zinc-900">
            <details className="group py-6">
              <summary className="flex items-center justify-between text-zinc-200 font-medium hover:text-white transition-colors">
                What is llms.txt?
                <ChevronDown size={16} className="text-zinc-600 chevron group-hover:text-zinc-300" />
              </summary>
              <p className="mt-3 text-sm text-zinc-500 leading-relaxed pr-8">
                An open standard similar to <code className="font-mono text-zinc-400 bg-zinc-900/80 px-1 rounded border border-zinc-850">robots.txt</code>. It provides AI language models with a structured, 
                token-efficient summary of your website at <code className="font-mono text-zinc-400 bg-zinc-900/80 px-1 rounded border border-zinc-850">yoursite.com/llms.txt</code>.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex items-center justify-between text-zinc-200 font-medium hover:text-white transition-colors">
                Do I need to change my DNS?
                <ChevronDown size={16} className="text-zinc-600 chevron group-hover:text-zinc-300" />
              </summary>
              <p className="mt-3 text-sm text-zinc-500 leading-relaxed pr-8">
                No. CrlContxt gives you a tiny edge script. Drop it as Vercel middleware or a Cloudflare Worker. Your existing site stays untouched.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex items-center justify-between text-zinc-200 font-medium hover:text-white transition-colors">
                Which AI bots are tracked?
                <ChevronDown size={16} className="text-zinc-600 chevron group-hover:text-zinc-300" />
              </summary>
              <p className="mt-3 text-sm text-zinc-500 leading-relaxed pr-8">
                ChatGPT, Claude, Perplexity, and Googlebot are identified by User-Agent. All other bots are logged under &quot;Other&quot; and still fully tracked.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex items-center justify-between text-zinc-200 font-medium hover:text-white transition-colors">
                What is the WebMCP Form Upgrader?
                <ChevronDown size={16} className="text-zinc-600 chevron group-hover:text-zinc-300" />
              </summary>
              <p className="mt-3 text-sm text-zinc-500 leading-relaxed pr-8">
                A tool that injects <code className="font-mono text-zinc-400 bg-zinc-900/80 px-1 rounded border border-zinc-850">data-mcp-*</code> attributes into your HTML forms, turning them into structured tools AI agents can interact with programmatically.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex items-center justify-between text-zinc-200 font-medium hover:text-white transition-colors">
                Is CrlContxt free?
                <ChevronDown size={16} className="text-zinc-600 chevron group-hover:text-zinc-300" />
              </summary>
              <p className="mt-3 text-sm text-zinc-500 leading-relaxed pr-8">
                Yes. Create an account, add domains, generate files, and deploy — all free. Premium tiers for advanced analytics are coming soon.
              </p>
            </details>

            <details className="group py-6">
              <summary className="flex items-center justify-between text-zinc-200 font-medium hover:text-white transition-colors">
                Does it work with SPAs?
                <ChevronDown size={16} className="text-zinc-600 chevron group-hover:text-zinc-300" />
              </summary>
              <p className="mt-3 text-sm text-zinc-500 leading-relaxed pr-8">
                Yes. Even if your SPA renders nothing server-side, CrlContxt extracts title and meta tags from the HTML response. The llms.txt file bridges the gap bots can&apos;t cross alone.
              </p>
            </details>
          </ScrollReveal>
        </div>
      </section>

      <div className="gradient-line" />

      {/* ═══ 10. FINAL CTA + FOOTER ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Ready to go AI-native?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400">
              Set up takes less time than reading this sentence.
            </p>
            <Link href="/signup" className="group inline-flex items-center gap-2 mt-10 bg-white text-zinc-950 font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-zinc-200 active:scale-[0.98] transition-all">
              Create your free account
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-zinc-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-none">
                <circle cx="16" cy="16" r="10" stroke="#a1a1aa" strokeWidth="2.5" strokeDasharray="16 8" strokeLinecap="round" />
                <circle cx="16" cy="16" r="5" stroke="#71717a" strokeWidth="2" strokeDasharray="8 4" strokeLinecap="round" />
                <circle cx="16" cy="16" r="1.5" fill="#a1a1aa" />
              </svg>
              <span className="text-sm font-bold text-zinc-500 tracking-tight">crlcontxt</span>
            </Link>
            <span className="text-xs text-zinc-700">
              Built with Next.js, Supabase & Vercel Edge
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-700">
            <Link href="/signin" className="hover:text-zinc-400 transition-colors">Log in</Link>
            <Link href="/signup" className="hover:text-zinc-400 transition-colors">Sign up</Link>
            <a href="#how-it-works" className="hover:text-zinc-400 transition-colors">How it works</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 text-center">
          <p className="text-xs text-zinc-800">&copy; {new Date().getFullYear()} CrlContxt. Built for the agentic web.</p>
        </div>
      </footer>

    </main>
  );
}
