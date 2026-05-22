import { logout } from '@/app/actions/auth';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-56 bg-zinc-950 border-r border-zinc-900 flex flex-col">
        <Link href="/" className="p-5">
          <span className="text-sm font-bold text-white">agentic</span>
        </Link>

        <nav className="flex flex-col gap-0.5 px-2 mt-2">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors px-5 py-2 rounded-md"
          >
            Domains
          </Link>
          <Link
            href="/dashboard/analytics"
            className="text-sm text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors px-5 py-2 rounded-md"
          >
            Analytics
          </Link>
          <Link
            href="/dashboard/webmcp"
            className="text-sm text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors px-5 py-2 rounded-md"
          >
            WebMCP
          </Link>
        </nav>

        <div className="mt-auto p-2">
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-zinc-600 hover:text-red-400 px-5 py-2 transition-colors w-full text-left"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 bg-zinc-950 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
