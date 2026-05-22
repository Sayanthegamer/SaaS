import { ArrowRight, Bot, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black overflow-hidden relative">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
      
      <header className="w-full max-w-5xl mx-auto p-6 flex justify-between items-center z-10">
        <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Agentic.
        </div>
        <nav>
          <button className="px-6 py-2 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur hover:bg-slate-700 hover:text-cyan-400 transition-all duration-300 font-semibold text-sm">
            Sign In
          </button>
        </nav>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 w-full max-w-4xl mx-auto gap-8 mt-12 mb-24">
        <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight text-white drop-shadow-xl">
          Speak natively to <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse">
            AI Agents.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed">
          The ultimate deterministic reverse-proxy for enterprise websites. Stop relying on hallucinations. Guarantee your brand is read perfectly by ChatGPT, Claude, and Perplexity.
        </p>

        {/* Self-Referential WebMCP Form */}
        <article className="mt-8 w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl shadow-cyan-900/20 hover:-translate-y-1 hover:shadow-cyan-500/30 transition-all duration-500">
          <form 
            action="/api/signup" 
            method="POST" 
            className="flex flex-col gap-4"
            // Stage 5 Hardening: Self-Referential WebMCP Injection
            // @ts-expect-error custom attributes
            toolname="register_for_early_access"
            tooldescription="Registers the user's email to get early access to the Agentic SaaS."
          >
            <label htmlFor="email" className="sr-only">Email Address</label>
            <input 
              id="email"
              type="email" 
              name="email"
              required
              placeholder="Enter your work email"
              className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              // @ts-expect-error custom attributes
              toolparamdescription="The user's professional email address."
            />
            <button 
              type="submit" 
              className="group flex items-center justify-center gap-2 w-full bg-white text-black font-bold text-lg px-6 py-3 rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300"
            >
              Get Early Access
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </article>
      </section>

      <section className="w-full bg-slate-900/40 border-t border-slate-800 py-24 z-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-300">
            <Bot className="text-cyan-400" size={32} />
            <h3 className="text-xl font-bold text-white">llms.txt Generation</h3>
            <p className="text-slate-400 leading-relaxed">Automatically scrape your sitemap and compress it into an LLM-optimized 3,000 token index.</p>
          </div>
          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800 transition-all duration-300">
            <Shield className="text-purple-400" size={32} />
            <h3 className="text-xl font-bold text-white">Deterministic Control</h3>
            <p className="text-slate-400 leading-relaxed">No black-box AI wrappers. Pure, predictable reverse-proxying so you control what agents see.</p>
          </div>
          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300">
            <Zap className="text-blue-400" size={32} />
            <h3 className="text-xl font-bold text-white">Edge Caching</h3>
            <p className="text-slate-400 leading-relaxed">Deployed via Cloudflare Workers for 0ms latency responses to web crawlers globally.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
