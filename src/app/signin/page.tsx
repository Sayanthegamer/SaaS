import { login } from '@/app/actions/auth';
import Link from 'next/link';
import SubmitButton from '@/components/SubmitButton';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await searchParams;
  const error = resolvedParams?.error;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-sm animate-in">
        <div className="text-center mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-none">
              <circle cx="16" cy="16" r="10" stroke="#f4f4f5" strokeWidth="2.5" strokeDasharray="16 8" strokeLinecap="round" />
              <circle cx="16" cy="16" r="5" stroke="#a1a1aa" strokeWidth="2" strokeDasharray="8 4" strokeLinecap="round" />
              <circle cx="16" cy="16" r="1.5" fill="#ffffff" />
            </svg>
            <span className="text-sm font-bold text-white tracking-tight">crlcontxt</span>
          </Link>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-white">Welcome back</h1>
            <p className="text-sm text-zinc-500 mt-1">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 text-red-400 bg-red-950/50 border border-red-900/50 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm px-3 py-2.5 rounded-lg focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 outline-none placeholder:text-zinc-600 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm px-3 py-2.5 rounded-lg focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 outline-none placeholder:text-zinc-600 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <SubmitButton
              formAction={login}
              className="w-full mt-2 bg-white text-zinc-950 font-medium text-sm py-2.5 rounded-lg hover:bg-zinc-200 active:scale-[0.99] transition-all"
            >
              Sign in
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-zinc-400 hover:text-white transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
