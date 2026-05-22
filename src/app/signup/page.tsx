import { signup } from '@/app/actions/auth';
import Link from 'next/link';

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await searchParams;
  const error = resolvedParams?.error;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-sm font-bold text-white">
            agentic
          </Link>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-white">Create an account</h1>
            <p className="text-sm text-zinc-500 mt-1">Get started with Agentic</p>
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

            <button
              formAction={signup}
              className="w-full mt-2 bg-white text-zinc-950 font-medium text-sm py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-zinc-400 hover:text-white transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
