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
        <h1 className="text-xl font-semibold text-white">WebMCP Form Upgrader</h1>
        <p className="text-sm text-zinc-500 mt-1">Upgrade your raw HTML forms into Agent-Ready tools.</p>
      </div>
      
      <WebMCPInjector />
    </div>
  )
}
