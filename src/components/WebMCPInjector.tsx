'use client'

import { useState } from 'react';
import { upgradeHtmlForm } from '@/app/actions/webmcp';
import { Loader2 } from 'lucide-react';

export default function WebMCPInjector() {
  const [rawHtml, setRawHtml] = useState('');
  const [toolName, setToolName] = useState('book_appointment');
  const [toolDescription, setToolDescription] = useState('Submits the user details to book a consultation.');
  
  const [upgradedHtml, setUpgradedHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError('');
    
    const result = await upgradeHtmlForm(rawHtml, toolName, toolDescription);
    
    if (result.success && result.upgradedHtml) {
      setUpgradedHtml(result.upgradedHtml);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upgradedHtml);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Tool Name (no spaces)</label>
          <input 
            type="text" 
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm px-3 py-2.5 rounded-lg focus:border-zinc-600 outline-none placeholder:text-zinc-600"
            placeholder="e.g., submit_lead"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Tool Description</label>
          <input 
            type="text" 
            value={toolDescription}
            onChange={(e) => setToolDescription(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm px-3 py-2.5 rounded-lg focus:border-zinc-600 outline-none placeholder:text-zinc-600"
            placeholder="Describe exactly what this form does."
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Paste Raw HTML Form</label>
        <textarea 
          value={rawHtml}
          onChange={(e) => setRawHtml(e.target.value)}
          className="w-full h-44 bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-xs px-3 py-2.5 rounded-lg focus:border-zinc-600 outline-none placeholder:text-zinc-600"
          placeholder="<form action='/submit'>...</form>"
        />
      </div>

      <button 
        onClick={handleUpgrade}
        disabled={isLoading || !rawHtml}
        className="flex items-center justify-center gap-2 bg-white text-zinc-950 font-medium text-sm w-full py-2.5 rounded-lg hover:bg-zinc-200 disabled:opacity-40 transition-colors"
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        {isLoading ? 'Processing...' : 'Upgrade Form to Agent-Ready'}
      </button>

      {error && (
        <div className="text-sm text-red-400 bg-red-950/50 border border-red-900/50 rounded-lg p-3">
          {error}
        </div>
      )}

      {upgradedHtml && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-emerald-500">Agent-Ready HTML Generated</span>
            <button onClick={copyToClipboard} className="text-xs text-zinc-500 hover:text-white transition-colors">
              Copy code
            </button>
          </div>
          <textarea 
            readOnly
            value={upgradedHtml}
            className="w-full h-44 bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 px-3 py-2.5 rounded-lg outline-none"
          />
        </div>
      )}
    </div>
  );
}
