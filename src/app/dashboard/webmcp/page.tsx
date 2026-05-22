import WebMCPInjector from '@/components/WebMCPInjector'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WebMCPPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  return (
    <div className="py-8 px-6 w-full max-w-5xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white">WebMCP Form Upgrader</h1>
        <p className="text-slate-400 mt-1">Upgrade your raw HTML forms into Agent-Ready tools.</p>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <WebMCPInjector />
      </div>
    </div>
  )
}
