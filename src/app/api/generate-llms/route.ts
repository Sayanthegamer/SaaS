import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Client } from '@upstash/qstash';

// Initialize with a dummy token if undefined so the build doesn't fail,
// but handle the actual dispatch gracefully.
const qstashClient = new Client({ token: process.env.QSTASH_TOKEN || 'mock-token' });

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let domainId: string, domainUrl: string;
  try {
    const body = await request.json();
    domainId = body.domainId;
    domainUrl = body.domainUrl;
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!domainId || !domainUrl) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

  try {
    // 1. Mark as active
    const { data, error: updateError } = await supabase.from('domains').update({ status: 'active' }).eq('id', domainId).select();
    if (updateError || !data || data.length === 0) {
      console.error('Failed to mark domain as active:', updateError);
      return NextResponse.json({ error: 'Failed to update domain status' }, { status: 500 });
    }

    // 2. Dispatch the background job
    if (process.env.QSTASH_TOKEN) {
      await qstashClient.publishJSON({
        url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/api/workers/scrape`,
        body: { domainId, domainUrl, userId: user.id },
        retries: 3, // QStash handles the retries if the worker fails
      });
    } else {
      console.warn('QSTASH_TOKEN missing. Mocking background job dispatch.');
      // In a local dev environment without ngrok, you might just trigger it asynchronously
      // here as a temporary local-only workaround, but NEVER in prod.
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/workers/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId, domainUrl, userId: user.id })
      }).catch(console.error);
    }

    // 3. Return immediately so the UI can show the loading state
    return NextResponse.json({ success: true, status: 'processing' });

  } catch (error: unknown) {
    console.error('Failed to dispatch job:', error);
    await supabase.from('domains').update({ status: 'failed' }).eq('id', domainId);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
