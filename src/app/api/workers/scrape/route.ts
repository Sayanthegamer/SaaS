import { Receiver } from '@upstash/qstash';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchSitemapUrls, scrapeMetadata, compileLlmsTxt } from '@/lib/scraper';

// If using Vercel Pro, you can force this specific route to run longer
// export const maxDuration = 300;

export async function POST(request: Request) {


  async function verifyQStashSignature(request: Request) {
    if (process.env.QSTASH_TOKEN) {
      const signature = request.headers.get("Upstash-Signature");
      if (!signature) {
        throw new Error("Missing Upstash-Signature header");
      }

      const receiver = new Receiver({
        currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "",
        nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "",
      });

      const body = await request.text();
      const isValid = await receiver.verify({
        signature,
        body,
      });

      if (!isValid) {
        throw new Error("Invalid signature");
      }
      return JSON.parse(body);
    } else {
        return await request.json();
    }
  }



  let domainId: string, domainUrl: string;
  try {
     const body = await verifyQStashSignature(request);
     domainId = body.domainId;
     domainUrl = body.domainUrl;
     if (!domainId || !domainUrl) return NextResponse.json({ error: 'Bad Request: missing domainId or domainUrl' }, { status: 400 });
  } catch (error) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
    const { error: updateCompleteError } = await supabase.from('domains').update({ status: 'active' }).eq('id', domainId);
    if (updateCompleteError) {
        console.error('Failed to update domain status to completed:', updateCompleteError);
        throw updateCompleteError;
    }
    console.log('[Worker] Successfully completed scrape for domain:', domainUrl);

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('[Worker] Scrape failed for domain:', domainUrl, error);
    const { error: updateFailedError } = await supabase.from('domains').update({ status: 'failed' }).eq('id', domainId);
    if (updateFailedError) {
        console.error('Failed to update domain status to failed:', updateFailedError);
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
