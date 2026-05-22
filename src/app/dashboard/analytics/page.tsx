import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AnalyticsCharts from '@/components/AnalyticsCharts'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // 1. Fetch user's domains
  const { data: domains } = await supabase
    .from('domains')
    .select('id, domain_url')
    .eq('user_id', user.id)

  if (!domains || domains.length === 0) {
    return (
      <div className="py-8 px-6 w-full max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold text-white">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-1">You need to add a domain first to see analytics.</p>
      </div>
    )
  }

  const domainIds = domains.map(d => d.id)

  // 2. Fetch analytics for these domains
  const { data: analyticsData } = await supabase
    .from('analytics')
    .select('*')
    .in('domain_id', domainIds)

  // 3. Process the data
  const totalReads = analyticsData?.length || 0
  
  const botCounts: Record<string, number> = {}
  analyticsData?.forEach(row => {
    botCounts[row.bot_name] = (botCounts[row.bot_name] || 0) + 1
  })

  const botChartData = Object.keys(botCounts).map(name => ({
    name,
    reads: botCounts[name]
  }))

  // Time series data (last 7 days)
  const timeSeries: Record<string, number> = {}
  
  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    timeSeries[dateStr] = 0
  }

  analyticsData?.forEach(row => {
    const dateStr = new Date(row.created_at).toISOString().split('T')[0]
    if (timeSeries[dateStr] !== undefined) {
      timeSeries[dateStr] += 1
    }
  })

  const timeChartData = Object.keys(timeSeries).map(date => ({
    date,
    reads: timeSeries[date]
  }))

  return (
    <div className="py-8 px-6 w-full max-w-5xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-white">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-1">Track how often AI agents read your domain&apos;s llms.txt.</p>
      </div>
      
      <div className="grid grid-cols-3 gap-px bg-zinc-800 rounded-xl overflow-hidden">
        <div className="bg-zinc-950 p-6 text-center">
          <span className="block text-xs font-mono text-zinc-600 uppercase tracking-wider mb-2">Total AI Reads</span>
          <span className="block text-3xl font-extrabold text-white">{totalReads}</span>
        </div>
        
        <div className="bg-zinc-950 p-6 text-center">
          <span className="block text-xs font-mono text-zinc-600 uppercase tracking-wider mb-2">Top Bot</span>
          <span className="block text-3xl font-extrabold text-white">
            {botChartData.length > 0 ? botChartData.sort((a,b) => b.reads - a.reads)[0].name : 'N/A'}
          </span>
        </div>

        <div className="bg-zinc-950 p-6 text-center">
          <span className="block text-xs font-mono text-zinc-600 uppercase tracking-wider mb-2">Active Domains</span>
          <span className="block text-3xl font-extrabold text-white">{domains.length}</span>
        </div>
      </div>

      <div className="mt-8">
        <AnalyticsCharts botData={botChartData} timeData={timeChartData} />
      </div>
    </div>
  )
}
