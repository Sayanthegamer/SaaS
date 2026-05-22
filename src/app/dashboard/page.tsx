import { createClient } from '@/lib/supabase/server'
import DomainManager from '@/components/DomainManager'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  const { data: domains } = await supabase
    .from('domains')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="py-8">
      <DomainManager initialDomains={domains || []} />
    </div>
  )
}
