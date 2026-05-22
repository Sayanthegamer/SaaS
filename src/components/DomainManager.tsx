'use client'

import { useState } from 'react'
import { addDomain, deleteDomain } from '@/app/actions/domains'
import { Loader2 } from 'lucide-react'

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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Generation failed');
      }
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
      <div>
        <h1 className="text-xl font-semibold text-white">Domains</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your domains and generate llms.txt files.</p>
      </div>

      <form action={handleAddDomain} className="flex gap-3">
        <input
          name="domainUrl"
          type="url"
          required
          placeholder="https://example.com"
          className="flex-1 bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 px-3 py-2.5 rounded-lg focus:border-zinc-600 outline-none placeholder:text-zinc-600"
        />
        <button
          type="submit"
          className="bg-white text-zinc-950 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Add Domain
        </button>
      </form>

      <div className="flex flex-col divide-y divide-zinc-900">
        {initialDomains.length === 0 ? (
          <div className="text-center py-16 text-sm text-zinc-600">
            No domains added yet. Add one above to get started.
          </div>
        ) : (
          initialDomains.map(domain => (
            <div key={domain.id}>
              <div className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-200">{domain.domain_url}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-mono uppercase tracking-wider ${
                      domain.status === 'active' ? 'text-emerald-500' :
                      domain.status === 'failed' ? 'text-red-400' :
                      'text-zinc-500'
                    }`}>
                      {domain.status}
                    </span>
                    <span className="text-xs text-zinc-700">
                      {new Date(domain.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleGenerate(domain.id, domain.domain_url)}
                    disabled={generatingId === domain.id}
                    className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 border border-zinc-800 px-3 py-1.5 rounded-md hover:text-white hover:bg-zinc-900 transition-colors disabled:opacity-50"
                  >
                    {generatingId === domain.id && <Loader2 size={12} className="animate-spin" />}
                    {domain.status === 'active' ? 'Regenerate' : 'Generate'}
                  </button>

                  {domain.status === 'active' && (
                    <button
                      onClick={() => setShowEdgeWorker(showEdgeWorker === domain.id ? null : domain.id)}
                      className="text-xs font-medium text-zinc-500 border border-zinc-800 px-3 py-1.5 rounded-md hover:text-white hover:bg-zinc-900 transition-colors"
                    >
                      Edge Script
                    </button>
                  )}

                  <button
                    onClick={() => deleteDomain(domain.id)}
                    className="text-xs text-zinc-700 hover:text-red-400 px-2 py-1.5 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {showEdgeWorker === domain.id && (
                <div className="mt-3 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-2">
                    Deploy this script to Cloudflare Workers to proxy your <code className="text-zinc-300">llms.txt</code> file automatically.
                  </p>
                  <textarea
                    readOnly
                    className="w-full h-44 bg-zinc-950 p-3 rounded border border-zinc-800 text-xs font-mono text-zinc-400 outline-none"
                    value={`export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/llms.txt') {
      const response = await fetch('https://saas-eta-rose.vercel.app/api/serve-llms?domain=' + encodeURIComponent('${domain.domain_url}'));
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
  )
}
