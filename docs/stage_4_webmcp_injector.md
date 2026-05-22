# Stage 4: WebMCP Schema Injector (Declarative API)

This stage covers the utility tool that upgrades standard HTML forms into "Agent-Ready" forms that comply with the WebMCP W3C proposed standard. This is required to pass the Lighthouse Agentic Browsing audit.

## 1. HTML Parsing Server Action

Because parsing complex, potentially malformed HTML strings on the client side can be unstable and heavy on the browser, we will use a Next.js Server Action leveraging `node-html-parser`.

### `app/actions/webmcp.ts`
```typescript
'use server'

import { parse } from 'node-html-parser';

export interface WebMCPInjectionResult {
  success: boolean;
  upgradedHtml?: string;
  error?: string;
  formCount?: number;
}

export async function upgradeHtmlForm(
  rawHtml: string, 
  toolName: string, 
  toolDescription: string
): Promise<WebMCPInjectionResult> {
  
  if (!rawHtml || !toolName || !toolDescription) {
    return { success: false, error: 'Missing required parameters.' };
  }

  try {
    // Parse the raw HTML safely on the server
    const root = parse(rawHtml);
    
    // Find all forms in the pasted code
    const forms = root.querySelectorAll('form');
    
    if (forms.length === 0) {
      return { success: false, error: 'No <form> elements found in the provided HTML.' };
    }

    // Inject WebMCP attributes into every form found
    forms.forEach((form, index) => {
      // If multiple forms exist, we append an index to the toolname to ensure uniqueness
      const uniqueToolName = forms.length > 1 ? `${toolName}_${index + 1}` : toolName;
      
      form.setAttribute('toolname', uniqueToolName);
      form.setAttribute('tooldescription', toolDescription);

      // Map over all inputs within the form to inject param descriptions
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        const nameAttr = input.getAttribute('name');
        const typeAttr = input.getAttribute('type');
        
        // Construct a logical description based on the input's existing attributes
        let paramDescription = `User input for ${nameAttr || 'this field'}`;
        
        if (typeAttr === 'email') paramDescription = 'The user\'s email address';
        if (nameAttr?.toLowerCase().includes('phone')) paramDescription = 'The user\'s phone number';
        if (nameAttr?.toLowerCase().includes('company')) paramDescription = 'The user\'s company name';
        
        input.setAttribute('toolparamdescription', paramDescription);
      });
    });

    // Serialize the DOM tree back to an HTML string
    return {
      success: true,
      upgradedHtml: root.toString(),
      formCount: forms.length
    };

  } catch (error: any) {
    console.error('WebMCP parsing failed:', error);
    return { success: false, error: 'Failed to parse HTML structure.' };
  }
}
```

## 2. The Frontend Client Component

This component provides the UI where users paste their raw code and receive the upgraded code instantly.

### `components/WebMCPInjector.tsx`
```typescript
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
```

## Next Steps
This concludes the theoretical architecture and planning phase! We have fully documented the backend, the edge network, and the frontend logic. 

We are now ready to begin execution by running the initialization commands from **Stage 1**.
