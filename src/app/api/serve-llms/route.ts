import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseUrl.startsWith('http') || !serviceRoleKey) {
      throw new Error('Invalid Supabase URL or Service Role Key');
    }
    supabaseClient = createClient(supabaseUrl, serviceRoleKey);
  }
  return supabaseClient;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domainUrl = searchParams.get('domain');

  if (!domainUrl) {
    return new NextResponse('Bad Request: Missing domain parameter', { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabase();
  } catch (err: any) {
    console.error('Supabase initialization failed:', err);
    return new NextResponse('Service Unavailable: Database not configured', { status: 503 });
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

    // 3. Log Analytics (Fire-and-forget to avoid blocking the response)
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    let botName = 'Other';
    if (userAgent.includes('ChatGPT')) botName = 'ChatGPT';
    else if (userAgent.includes('Claude')) botName = 'ClaudeBot';
    else if (userAgent.includes('Perplexity')) botName = 'Perplexity';
    else if (userAgent.includes('Googlebot')) botName = 'Googlebot';

    supabase.from('analytics').insert({
      domain_id: domainData.id,
      bot_name: botName,
      user_agent: userAgent
    }).then((res: any) => {
      if (res.error) console.error('Failed to log analytics:', res.error);
    });

    // 4. Return the file with proper headers for AI agents and strict caching
    return new NextResponse(fileData.content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error serving llms.txt:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
