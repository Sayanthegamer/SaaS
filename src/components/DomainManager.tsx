'use client'

import { useState } from 'react'
import { addDomain, deleteDomain } from '@/app/actions/domains'
import { Globe, Plus, Play, Trash2, CheckCircle2, XCircle, Loader2, Code2 } from 'lucide-react'

type Domain = {
  id: string;
  domain_url: string;
  status: string;
  created_at: string;
}

export default function DomainManager({ initialDomains }: { initialDomains: Domain[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [showEdgeWorker, setShowEdgeWorker] = useState<string | null>(null)

  const handleGenerate = async (domainId: string, domainUrl: string) => {
    setGeneratingId(domainId)
    try {
      const res = await fetch('/api/generate-llms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId, domainUrl })
      })
      if (!res.ok) throw new Error('Generation failed')
      window.location.reload()
    } catch (error) {
      alert(error)
    } finally {
      setGeneratingId(null)
    }
  }

  const handleAddDomain = async (formData: FormData) => {
    const result = await addDomain(formData);
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Domains</h1>
          <p className="text-slate-400 mt-1">Manage your domains and generate llms.txt files.</p>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <form action={handleAddDomain} className="flex gap-4 mb-8">
          <input 
            name="domainUrl"
            type="url"
            required
            placeholder="https://example.com"
            className="flex-1 bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          <button 
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-all"
          >
            <Plus size={20} />
            Add Domain
          </button>
        </form>

        <div className="flex flex-col gap-4">
          {initialDomains.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-slate-800 border-dashed rounded-xl">
              <Globe size={48} className="mx-auto mb-4 opacity-50" />
              <p>No domains added yet. Add one above to get started.</p>
            </div>
          ) : (
            initialDomains.map(domain => (
              <div key={domain.id} className="flex flex-col gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <Globe className="text-cyan-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">{domain.domain_url}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          domain.status === 'active' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
                          domain.status === 'failed' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
                          'bg-slate-800 border-slate-600 text-slate-400'
                        }`}>
                          {domain.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">
                          Added {new Date(domain.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleGenerate(domain.id, domain.domain_url)}
                      disabled={generatingId === domain.id}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all disabled:opacity-50"
                    >
                      {generatingId === domain.id ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                      {domain.status === 'active' ? 'Regenerate' : 'Generate'}
                    </button>
                    
                    {domain.status === 'active' && (
                      <button 
                        onClick={() => setShowEdgeWorker(showEdgeWorker === domain.id ? null : domain.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm font-semibold text-slate-300 hover:text-purple-400 hover:border-purple-500/50 transition-all"
                      >
                        <Code2 size={16} />
                        Edge Script
                      </button>
                    )}

                    <button 
                      onClick={() => deleteDomain(domain.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {showEdgeWorker === domain.id && (
                  <div className="mt-4 p-4 bg-black/50 border border-purple-500/30 rounded-lg">
                    <p className="text-sm text-slate-400 mb-2">
                      Deploy this script to Cloudflare Workers to proxy your <code className="text-purple-300">llms.txt</code> file automatically.
                    </p>
                    <textarea 
                      readOnly
                      className="w-full h-48 bg-slate-950 p-4 rounded border border-slate-800 text-sm font-mono text-cyan-400 outline-none"
                      value={`export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/llms.txt') {
      const response = await fetch('https://[YOUR_SAAS_DOMAIN]/api/serve-llms?domain=' + encodeURIComponent('${domain.domain_url}'));
      if (response.ok) {
        return new Response(await response.text(), { 
          headers: { 'Content-Type': 'text/plain' } 
        });
      }
    }
    return fetch(request);
  }
}`}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
