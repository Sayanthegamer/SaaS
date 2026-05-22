'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#e4e4e7', '#a1a1aa', '#71717a', '#52525b', '#3f3f46']

export default function AnalyticsCharts({ 
  botData, 
  timeData 
}: { 
  botData: { name: string, reads: number }[],
  timeData: { date: string, reads: number }[]
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      {/* Time Series Chart */}
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Reads over last 7 days</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" stroke="#3f3f46" fontSize={11} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
              <YAxis stroke="#3f3f46" fontSize={11} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: '#27272a' }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#fafafa' }}
                itemStyle={{ color: '#fafafa' }}
              />
              <Bar dataKey="reads" fill="#e4e4e7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bot Breakdown Chart */}
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Bot Breakdown</h3>
        <div className="h-64 w-full flex justify-center items-center">
          {botData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={botData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="reads"
                >
                  {botData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#fafafa' }}
                  itemStyle={{ color: '#fafafa' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-zinc-600">No bot data available yet.</div>
          )}
        </div>
        
        {/* Custom Legend for Pie Chart */}
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          {botData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-xs text-zinc-500">{entry.name} ({entry.reads})</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
