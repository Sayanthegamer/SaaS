import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchSitemapUrls, scrapeMetadata, compileLlmsTxt } from '@/lib/scraper';

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { domainId, domainUrl } = await request.json();
  if (!domainId || !domainUrl) {
    return NextResponse.json({ error: 'Missing domain parameters' }, { status: 400 });
  }

  try {
    // 2. Update status to 'active' indicating processing has started
    await supabase.from('domains').update({ status: 'active' }).eq('id', domainId);

    // 3. Scrape and generate the data
    const urls = await fetchSitemapUrls(domainUrl);
    const metadata = await scrapeMetadata(urls);
    const domainName = new URL(domainUrl).hostname;
    
    const { markdown, tokenCount } = compileLlmsTxt(domainName, metadata);

    // 4. Save the generated Markdown to Supabase (upsert handles updates if domain_id exists)
    const { error: dbError } = await supabase.from('llms_files').upsert({
      domain_id: domainId,
      content: markdown,
      token_count: tokenCount,
      last_updated: new Date().toISOString()
    }, { onConflict: 'domain_id' });

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, tokenCount });

  } catch (error: any) {
    console.error('Generation failed:', error);
    await supabase.from('domains').update({ status: 'failed' }).eq('id', domainId);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
