'use client'

import { useState } from 'react'
import { addDomain, deleteDomain, getLlmsFile, updateLlmsFile } from '@/app/actions/domains'
import { Loader2 } from 'lucide-react'
import SubmitButton from '@/components/SubmitButton'
import { countTokens } from '@/lib/tokenizer'

type Domain = {
  id: string;
  domain_url: string;
  status: string;
  created_at: string;
}

export default function DomainManager({ initialDomains }: { initialDomains: Domain[] }) {
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showEdgeWorker, setShowEdgeWorker] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editorContent, setEditorContent] = useState<string>('')
  const [isFetchingFile, setIsFetchingFile] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [tokenCount, setTokenCount] = useState<number>(0)

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

  const handleDelete = async (domainId: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;
    setDeletingId(domainId);
    try {
      const res = await deleteDomain(domainId);
      if (res?.error) {
        alert(res.error);
      }
    } catch (error) {
      alert(error);
    } finally {
      setDeletingId(null);
    }
  }

  const handleAddDomain = async (formData: FormData) => {
    const result = await addDomain(formData);
    if (result?.error) {
      alert(result.error);
    }
  };

  const handleStartEdit = async (domainId: string) => {
    if (editingId === domainId) {
      setEditingId(null)
      return
    }
    
    setShowEdgeWorker(null)
    setEditingId(domainId)
    setIsFetchingFile(true)
    try {
      const res = await getLlmsFile(domainId)
      if (res.error) {
        alert(res.error)
        setEditingId(null)
      } else {
        const content = res.content || ''
        setEditorContent(content)
        setTokenCount(countTokens(content))
      }
    } catch (error) {
      alert(error)
      setEditingId(null)
    } finally {
      setIsFetchingFile(false)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setEditorContent(val)
    setTokenCount(countTokens(val))
  }

  const handleSave = async (domainId: string) => {
    setIsSaving(true)
    try {
      const res = await updateLlmsFile(domainId, editorContent)
      if (res?.error) {
        alert(res.error)
      } else {
        setEditingId(null)
      }
    } catch (error) {
      alert(error)
    } finally {
      setIsSaving(false)
    }
  }

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
        <SubmitButton
          className="bg-white text-zinc-950 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors shrink-0"
        >
          Add Domain
        </SubmitButton>
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
                    <>
                      <button
                        onClick={() => handleStartEdit(domain.id)}
                        className={`text-xs font-medium border px-3 py-1.5 rounded-md transition-colors ${
                          editingId === domain.id
                            ? 'text-white bg-zinc-900 border-zinc-600'
                            : 'text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        Edit llms.txt
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null)
                          setShowEdgeWorker(showEdgeWorker === domain.id ? null : domain.id)
                        }}
                        className={`text-xs font-medium border px-3 py-1.5 rounded-md transition-colors ${
                          showEdgeWorker === domain.id
                            ? 'text-white bg-zinc-900 border-zinc-600'
                            : 'text-zinc-500 border-zinc-800 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        Edge Script
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(domain.id)}
                    disabled={deletingId === domain.id}
                    className="text-xs text-zinc-700 hover:text-red-400 px-2 py-1.5 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {deletingId === domain.id && <Loader2 size={12} className="animate-spin" />}
                    Delete
                  </button>
                </div>
              </div>

              {editingId === domain.id && (
                <div className="mt-3 p-4 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500">
                      Customize your <code className="text-zinc-300">llms.txt</code> content below. This manually edited version will be served instead of the auto-generated one.
                    </p>
                    {isFetchingFile && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                        <Loader2 size={12} className="animate-spin" />
                        Fetching content...
                      </div>
                    )}
                  </div>
                  
                  {!isFetchingFile && (
                    <>
                      <textarea
                        value={editorContent}
                        onChange={handleTextareaChange}
                        className="w-full h-80 bg-zinc-950 p-3 rounded border border-zinc-800 text-xs font-mono text-zinc-300 outline-none focus:border-zinc-700 resize-y"
                        placeholder="# Domain Title&#10;&#10;Customize your llms.txt content here..."
                      />
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500 font-medium">Size estimation:</span>
                          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                            tokenCount > 3000
                              ? 'text-red-400 border-red-900/50 bg-red-950/20'
                              : 'text-zinc-400 border-zinc-800 bg-zinc-950'
                          }`}>
                            {tokenCount.toLocaleString()} tokens {tokenCount > 3000 && '(exceeds 3,000)'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            disabled={isSaving}
                            className="text-xs text-zinc-500 hover:text-zinc-300 px-3 py-1.5 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSave(domain.id)}
                            disabled={isSaving}
                            className="text-xs bg-white text-zinc-950 font-medium px-4 py-1.5 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isSaving && <Loader2 size={12} className="animate-spin" />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

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
