# Stage 3: Edge Reverse Proxy & High-Availability API

This stage details the core enterprise feature of our SaaS: allowing clients using restrictive CMS platforms (HubSpot, Webflow, Shopify) to host their `llms.txt` file at their root domain via a reverse proxy. 

We must build two components:
1. A highly available, extremely fast Next.js API route that serves the raw markdown.
2. The Cloudflare Worker script template that the client installs.

## 1. High-Availability Delivery API

This endpoint (`/api/serve-llms`) is publicly accessible. It receives a `domain` parameter, queries Supabase, and returns the markdown text. 

Because this route will be hit by AI crawler bots, it must be extremely fast and utilize edge caching where possible.

### `app/api/serve-llms/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We use the standard supabase-js client here (not SSR) because this is a public, read-only endpoint.
// We only need the public Anon key. We will rely on strict RLS policies to ensure only active domains are served.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domainUrl = searchParams.get('domain');

  if (!domainUrl) {
    return new NextResponse('Bad Request: Missing domain parameter', { status: 400 });
  }

  try {
    // 1. Fetch domain ID (Ensure domain is active)
    const { data: domainData, error: domainError } = await supabase
      .from('domains')
      .select('id, status')
      .eq('domain_url', domainUrl)
      .single();

    if (domainError || !domainData || domainData.status !== 'active') {
      return new NextResponse('Domain not found or inactive', { status: 404 });
    }

    // 2. Fetch the llms.txt content
    const { data: fileData, error: fileError } = await supabase
      .from('llms_files')
      .select('content')
      .eq('domain_id', domainData.id)
      .single();

    if (fileError || !fileData) {
      return new NextResponse('File not generated yet', { status: 404 });
    }

    // 3. Return the file with proper headers for AI agents and strict caching
    return new NextResponse(fileData.content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        // Cache heavily at the CDN level (s-maxage) and browser level (max-age)
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200',
        'Access-Control-Allow-Origin': '*', // Allow all agents to fetch this
      },
    });

  } catch (error) {
    console.error('Error serving llms.txt:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
```

### Database Policy Adjustment
For the above code to work using the public anon key, we must add a public READ policy to Supabase:
```sql
-- Allow public read access to domains to verify active status
CREATE POLICY "Public can read active domains" 
ON domains FOR SELECT 
USING (status = 'active');

-- Allow public read access to files of active domains
CREATE POLICY "Public can read active llms files" 
ON llms_files FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM domains 
    WHERE domains.id = llms_files.domain_id 
    AND domains.status = 'active'
  )
);
```

## 2. Cloudflare Worker Script Template

This is the code snippet we display in the client's dashboard. The client copies this script into their Cloudflare Workers dashboard and assigns it to the route `*theirwebsite.com/llms.txt`.

### `public/edge-worker-template.js`
```javascript
/**
 * Agentic Web Infrastructure - Reverse Proxy Worker
 * 
 * Deploy this script as a Cloudflare Worker.
 * Assign it to the route: `*yourdomain.com/llms.txt`
 */

// Replace this with your actual SaaS API domain when moving to production
const SAAS_API_BASE = 'https://api.your-agentic-saas.com/api/serve-llms';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Safety check: Only intercept requests specifically for /llms.txt
    if (url.pathname === '/llms.txt') {
      
      // Extract the client's hostname (e.g., www.example.com)
      const clientHostname = url.hostname;
      
      // Construct the request to our SaaS backend
      const targetUrl = `${SAAS_API_BASE}?domain=${encodeURIComponent(clientHostname)}`;
      
      try {
        // Fetch the generated Markdown from the SaaS database
        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker-Proxy',
          }
        });
        
        if (response.ok) {
          const text = await response.text();
          // Serve the file to the AI Agent seamlessly
          return new Response(text, { 
            status: 200,
            headers: { 
              'Content-Type': 'text/plain; charset=utf-8',
              // Pass along any caching headers provided by the SaaS backend
              'Cache-Control': response.headers.get('Cache-Control') || 'public, max-age=3600',
            } 
          });
        } else {
          // If the SaaS returns a 404 (file not found/domain inactive)
          return new Response('llms.txt not found or inactive.', { status: 404 });
        }
      } catch (err) {
        // In case of a critical failure connecting to the SaaS API
        return new Response('Temporary proxy error.', { status: 502 });
      }
    }
    
    // If the request isn't for /llms.txt, pass it through to the client's normal website untouched.
    // (This acts as a failsafe in case they misconfigured their Cloudflare Route).
    return fetch(request);
  }
};
```

## Verification & Testing
Before moving to Stage 4 (WebMCP Form Injection), we must verify Stage 3 by:
1. Sending a mock `GET` request to `/api/serve-llms?domain=test.com` using Postman or cURL.
2. Ensuring the `Cache-Control` headers and `Access-Control-Allow-Origin` headers are correctly applied.
3. Deploying a mock Cloudflare worker locally using `Wrangler` to verify it successfully fetches and displays the string without throwing CORS errors.
