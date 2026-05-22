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
    const root = parse(rawHtml);
    const forms = root.querySelectorAll('form');
    
    if (forms.length === 0) {
      return { success: false, error: 'No <form> elements found in the provided HTML.' };
    }

    forms.forEach((form, index) => {
      const uniqueToolName = forms.length > 1 ? `${toolName}_${index + 1}` : toolName;
      
      form.setAttribute('toolname', uniqueToolName);
      form.setAttribute('tooldescription', toolDescription);

      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        const nameAttr = input.getAttribute('name');
        const typeAttr = input.getAttribute('type');
        
        let paramDescription = `User input for ${nameAttr || 'this field'}`;
        
        if (typeAttr === 'email') paramDescription = 'The user\'s email address';
        if (nameAttr?.toLowerCase().includes('phone')) paramDescription = 'The user\'s phone number';
        if (nameAttr?.toLowerCase().includes('company')) paramDescription = 'The user\'s company name';
        
        input.setAttribute('toolparamdescription', paramDescription);
      });
    });

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
