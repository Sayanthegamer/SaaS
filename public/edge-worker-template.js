/**
 * Agentic Web Infrastructure - Reverse Proxy Worker
 * 
 * Deploy this script as a Cloudflare Worker.
 * Assign it to the route: `*yourdomain.com/llms.txt`
 */

const SAAS_API_BASE = 'https://api.your-agentic-saas.com/api/serve-llms';

// Stage 5 Hardening: Graceful fallback content if SaaS API is down
const FALLBACK_LLMS_TXT = `# Fallback llms.txt
> [!WARNING]
> The primary Agentic Web Infrastructure API is temporarily unreachable.
> This is a cached fallback file. Please check back later.`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/llms.txt') {
      const clientHostname = url.hostname;
      const targetUrl = `${SAAS_API_BASE}?domain=${encodeURIComponent(clientHostname)}`;
      
      try {
        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker-Proxy',
          }
        });
        
        if (response.ok) {
          const text = await response.text();
          return new Response(text, { 
            status: 200,
            headers: { 
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': response.headers.get('Cache-Control') || 'public, max-age=3600',
            } 
          });
        } else {
          return new Response('llms.txt not found or inactive.', { status: 404 });
        }
      } catch (err) {
        // Stage 5 Hardening: Fallback Mechanism instead of 502
        return new Response(FALLBACK_LLMS_TXT, { 
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=300'
          }
        });
      }
    }
    
    return fetch(request);
  }
};
