# Agentic Web Infrastructure SaaS (GEO Optimizer) - Implementation Plan

Provide a highly technical, end-to-end blueprint for building a Generative Engine Optimization (GEO) SaaS. This platform will allow businesses to automatically generate `llms.txt` files and `WebMCP` declarative HTML schemas, bypassing CMS restrictions via a reverse-proxy Edge delivery network.

## User Review Required
> [!IMPORTANT]
> Please review the chosen technology stack and architecture. Specifically, we are proposing **Next.js (App Router)** paired with **Supabase** for the backend database, and **Cloudflare Workers** as the edge proxy solution for clients.

## Open Questions
> [!WARNING]
> 1. Do you want to use **Supabase** (Postgres) or **Firebase** for backend/database? Supabase is recommended for relational data (Users -> Domains -> Files).
> 2. Will you be handling payments via **Stripe** for the MVP, or should we build the core functionality first and add a paywall later?
> 3. Should we prioritize building the **llms.txt generator** first or the **WebMCP HTML schema injector**? (I recommend starting with the llms.txt feature as it's the core Lighthouse audit check and the fastest to build).

## Proposed Architecture & Changes

### 1. Core Framework & Database (Next.js + Supabase)
We will initialize a Next.js App Router project configured with TypeScript and Tailwind CSS.
- **Database Schema**: 
  - `users`: Standard auth table.
  - `domains`: Stores `id`, `user_id`, `domain_url`, `status`.
  - `llms_files`: Stores `domain_id`, `content` (Markdown string), `token_count`, `last_updated`.

### 2. Module A: Sitemap Parser & llms.txt Generator (Backend Node.js)
This is a server-side routine (Next.js API Route) to prevent CORS issues when scraping client sites and to securely run tokenization logic.

#### [NEW] `app/api/generate-llms/route.ts`
- **Input**: Target domain URL.
- **Process**:
  1. Append `/sitemap.xml` to the domain and fetch it.
  2. Parse the XML using a library like `fast-xml-parser` to extract a list of URLs (prioritizing top 10-20 pages based on depth/priority tags).
  3. Fetch the HTML of each target URL concurrently using `fetch`.
  4. Use `cheerio` to parse the DOM and extract `<title>`, `<meta name="description">`, and `<h1>` tags.
  5. **Token Limit Logic**: Use `tiktoken` (or a lightweight equivalent) to calculate the token count.
  6. **Markdown Compilation**: Construct the string starting with `# [Domain Name]`, followed by `> [Main description]`, then `## Pages` with bulleted lists of `[URL] - [Description]`.
  7. Save the final markdown string to the Supabase `llms_files` table.

### 3. Module B: WebMCP Schema Injector (Frontend / Server Action)
A utility tool for users to paste raw HTML forms and receive "Agent-Ready" code that passes the W3C Declarative API checks.

#### [NEW] `components/WebMCPInjector.tsx`
- **Process**: 
  - User pastes a raw HTML string (e.g., a lead capture form).
  - We use a server action with `node-html-parser` to safely traverse the DOM.
  - For each `<form>`, we prompt the user to assign a `toolname` and `tooldescription`.
  - We inject `toolname`, `tooldescription` into the `<form>` tag.
  - We inject `toolparamdescription` into `<input>` tags based on their `name` or `type` attributes.
  - We output the serialized, upgraded HTML back to the user with syntax highlighting.

### 4. Module C: Edge Reverse Proxy Network (The "Trojan Horse")
This is the enterprise feature that solves the HubSpot/Webflow root access problem. We generate a generic script the client places on their edge network (e.g., Cloudflare).

#### [NEW] `public/edge-worker-template.js`
- A Cloudflare Worker script template that we provide to the user to copy/paste.
- **Logic**:
  ```javascript
  export default {
    async fetch(request) {
      const url = new URL(request.url);
      if (url.pathname === '/llms.txt') {
        // Fetch dynamically from our SaaS API
        const response = await fetch(`https://api.oursaas.com/v1/serve-llms?domain=${url.hostname}`);
        if (response.ok) {
          const text = await response.text();
          return new Response(text, { headers: { 'Content-Type': 'text/plain' } });
        }
      }
      // Fallback to normal request
      return fetch(request);
    }
  }
  ```

#### [NEW] `app/api/serve-llms/route.ts`
- A high-availability public endpoint.
- Reads the incoming `domain` query parameter.
- Quickly queries Supabase for the generated markdown.
- Returns the markdown with a `text/plain` content type and aggressive `Cache-Control` headers for maximum speed.

## Verification Plan

### Automated Tests
- Unit test the Markdown Generator to ensure token count never exceeds 3,000.
- Unit test the WebMCP parser to ensure it does not corrupt existing HTML structure or strip existing classes/IDs.

### Manual Verification
- Deploy the app locally.
- Input a test domain (e.g., our own site).
- Verify the generated `llms.txt` formatting against the llmstxt.org specification.
- Deploy the Cloudflare Worker script to a test domain and verify `testdomain.com/llms.txt` successfully proxies our generated file without any CORS issues or latency spikes.
