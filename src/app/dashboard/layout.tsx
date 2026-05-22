import { logout } from '@/app/actions/auth';
import Link from 'next/link';
import { Globe, Wrench, LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-200 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-slate-800 bg-slate-900/50">
        <div className="p-6">
          <Link href="/" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Agentic.
          </Link>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors">
            <Globe size={18} />
            <span className="font-semibold">Domains</span>
          </Link>
          <Link href="/dashboard/webmcp" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-purple-400 transition-colors">
            <Wrench size={18} />
            <span className="font-semibold">WebMCP Tools</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <form action={logout}>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg text-red-400 hover:bg-red-950/30 transition-colors font-semibold">
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/20 via-slate-950 to-black">
        {children}
      </main>

    </div>
  );
}
