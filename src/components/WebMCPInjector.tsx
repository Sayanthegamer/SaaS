'use client'

import { useState } from 'react';
import { upgradeHtmlForm } from '@/app/actions/webmcp';
import { ClipboardCopy, Code, Settings } from 'lucide-react';

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
    alert('Copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-6 bg-slate-900 rounded-xl border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Code className="text-purple-400" />
        <h2 className="text-2xl font-bold text-white">WebMCP Form Upgrader</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-400 font-semibold">Tool Name (no spaces)</label>
          <input 
            type="text" 
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            className="p-3 bg-slate-800 border border-slate-700 rounded text-slate-200 focus:border-cyan-400 outline-none"
            placeholder="e.g., submit_lead"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-400 font-semibold">Tool Description</label>
          <input 
            type="text" 
            value={toolDescription}
            onChange={(e) => setToolDescription(e.target.value)}
            className="p-3 bg-slate-800 border border-slate-700 rounded text-slate-200 focus:border-cyan-400 outline-none"
            placeholder="Describe exactly what this form does."
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-slate-400 font-semibold">Paste Raw HTML Form Here</label>
        <textarea 
          value={rawHtml}
          onChange={(e) => setRawHtml(e.target.value)}
          className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded font-mono text-sm text-slate-300 focus:border-cyan-400 outline-none"
          placeholder="<form action='/submit'>...</form>"
        />
      </div>

      <button 
        onClick={handleUpgrade}
        disabled={isLoading || !rawHtml}
        className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
      >
        <Settings size={20} className={isLoading ? "animate-spin" : ""} />
        {isLoading ? 'Processing...' : 'Upgrade Form to Agent-Ready'}
      </button>

      {error && (
        <div className="text-red-400 text-sm p-4 bg-red-900/20 rounded border border-red-900/50">
          {error}
        </div>
      )}

      {upgradedHtml && (
        <div className="flex flex-col gap-2 mt-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center">
            <label className="text-sm text-green-400 font-semibold">Agent-Ready HTML Generated!</label>
            <button onClick={copyToClipboard} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
              <ClipboardCopy size={14} /> Copy Code
            </button>
          </div>
          <textarea 
            readOnly
            value={upgradedHtml}
            className="w-full h-48 p-4 bg-black border border-green-500/50 rounded font-mono text-sm text-green-400/90 outline-none"
          />
        </div>
      )}
    </div>
  );
}
