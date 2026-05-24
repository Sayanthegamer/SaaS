import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchSitemapUrls, scrapeMetadata, compileLlmsTxt } from '@/lib/scraper';

// If using Vercel Pro, you can force this specific route to run longer
// export const maxDuration = 300;

export async function POST(request: Request) {
  // TODO: Add QStash signature verification here later to ensure only Upstash can call this route.

  const { domainId, domainUrl } = await request.json();
  const supabase = await createClient(); // Use a service role key here if bypassing RLS is needed in the worker

  try {
    console.log('[Worker] Starting scrape for domain:', domainUrl);

    const urls = await fetchSitemapUrls(domainUrl);
    const metadata = await scrapeMetadata(urls);
    const domainName = new URL(domainUrl).hostname;

    const { markdown, tokenCount } = compileLlmsTxt(domainName, metadata);

    const { error: dbError } = await supabase.from('llms_files').upsert({
      domain_id: domainId,
      content: markdown,
      token_count: tokenCount,
      last_updated: new Date().toISOString()
    }, { onConflict: 'domain_id' });

    if (dbError) throw dbError;

    // Mark as complete
    await supabase.from('domains').update({ status: 'completed' }).eq('id', domainId);
    console.log('[Worker] Successfully completed scrape for domain:', domainUrl);

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('[Worker] Scrape failed for domain:', domainUrl, error);
    await supabase.from('domains').update({ status: 'failed' }).eq('id', domainId);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
