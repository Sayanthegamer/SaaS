'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#06b6d4', '#a855f7', '#3b82f6', '#10b981', '#f59e0b']

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
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-white mb-2">Reads over last 7 days</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" stroke="#475569" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
              <YAxis stroke="#475569" fontSize={12} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Bar dataKey="reads" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bot Breakdown Chart */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-white mb-2">Bot Breakdown</h3>
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
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-500 italic">No bot data available yet.</div>
          )}
        </div>
        
        {/* Custom Legend for Pie Chart */}
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          {botData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-sm text-slate-300">{entry.name} ({entry.reads})</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
