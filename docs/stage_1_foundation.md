# Stage 1: Foundation, Database, & Core Project Setup

This document outlines the exact, step-by-step technical implementation for the first phase of the Agentic Web Infrastructure SaaS.

## 1. Next.js Project Initialization

We will initialize a Next.js 14 App Router project with strict TypeScript configurations.

### Commands to Run
```bash
npx create-next-app@latest agentic-seo-saas \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir false \
  --import-alias "@/*"

cd agentic-seo-saas
```

### Core Dependencies Installation
We need specific packages for our backend logic:
```bash
# Supabase Auth and Server-Side Rendering tools
npm install @supabase/supabase-js @supabase/ssr

# Sitemap parsing and DOM manipulation for the llms.txt generator
npm install fast-xml-parser cheerio

# Token counting to strictly enforce the 3,000 token limit
npm install tiktoken

# UI Components (Radix UI / Lucide Icons)
npm install lucide-react clsx tailwind-merge
```

## 2. Supabase Database Schema (PostgreSQL)

We will use Supabase for our relational database. Below is the exact SQL required to set up the tables and Row Level Security (RLS) policies.

### SQL Execution
Execute the following in the Supabase SQL Editor:

```sql
-- 1. Create domains table
CREATE TABLE domains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    domain_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Create llms_files table to store generated markdown
CREATE TABLE llms_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE UNIQUE,
    content TEXT NOT NULL,
    token_count INTEGER NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE llms_files ENABLE ROW LEVEL SECURITY;

-- Create Policies for Domains
CREATE POLICY "Users can view their own domains" 
ON domains FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own domains" 
ON domains FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create Policies for LLMS Files
CREATE POLICY "Users can view llms files linked to their domains" 
ON llms_files FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM domains 
    WHERE domains.id = llms_files.domain_id 
    AND domains.user_id = auth.uid()
  )
);
```

## 3. Directory Structure

Your local project should mirror the following architecture before we write business logic. This ensures a clean separation of concerns:

```text
/agentic-seo-saas
├── /app
│   ├── /api
│   │   ├── /generate-llms     # Backend: Scrapes client site and generates Markdown
│   │   └── /serve-llms        # Edge: High availability route for reverse proxies
│   ├── /dashboard             # Protected user dashboard route
│   ├── layout.tsx
│   └── page.tsx               # Public landing page
├── /components
│   ├── /ui                    # Reusable UI components
│   └── WebMCPInjector.tsx     # The client-side HTML form injector component
├── /lib
│   ├── /supabase
│   │   ├── client.ts          # Browser Supabase client
│   │   ├── server.ts          # Server-side Supabase client
│   │   └── middleware.ts      # Next.js Auth protection middleware
│   ├── scraper.ts             # Cheerio DOM parsing logic isolation
│   └── tokenizer.ts           # tiktoken wrapper for token counting isolation
├── /public
│   └── edge-worker.js         # The template users will copy to Cloudflare
```

## 4. Supabase Server Client Configuration

To interact securely with our database from Server Components and API Routes, we must implement `@supabase/ssr`.

### `lib/supabase/server.ts`
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  )
}
```

## Next Steps
Once Stage 1 is verified and the basic skeleton is live, we will move to **Stage 2: Building the `/api/generate-llms` Scraping Engine**, which will contain the highly technical parsing and markdown compilation logic.
