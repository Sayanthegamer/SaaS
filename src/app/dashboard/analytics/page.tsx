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
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-slate-400">You need to add a domain first to see analytics.</p>
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
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-slate-400 mt-1">Track how often AI agents read your domain's llms.txt.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total AI Reads</span>
          <span className="text-5xl font-black text-cyan-400">{totalReads}</span>
        </div>
        
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Top Bot</span>
          <span className="text-3xl font-bold text-purple-400">
            {botChartData.length > 0 ? botChartData.sort((a,b) => b.reads - a.reads)[0].name : 'N/A'}
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Active Domains</span>
          <span className="text-4xl font-black text-blue-400">{domains.length}</span>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <AnalyticsCharts botData={botChartData} timeData={timeChartData} />
      </div>
    </div>
  )
}
