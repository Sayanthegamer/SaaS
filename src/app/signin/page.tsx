import { login } from '@/app/actions/auth';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await searchParams;
  const error = resolvedParams?.error;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
      
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl shadow-cyan-900/20">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            Agentic.
          </Link>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-2">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            formAction={login}
            className="group flex items-center justify-center gap-2 w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Sign In
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
