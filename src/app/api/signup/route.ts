import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseUrl.startsWith('http') || !supabaseKey) {
      throw new Error('Supabase client credentials are not configured.');
    }
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

export async function POST(request: Request) {
  let email = '';

  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      email = (formData.get('email') as string) || '';
    } else {
      const body = await request.json();
      email = body.email || '';
    }
  } catch (err) {
    console.error('Failed to parse signup request body:', err);
  }

  if (!email || !email.includes('@')) {
    return new NextResponse('Invalid email address.', { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabase();
  } catch (err: any) {
    console.error('Supabase initialization failed:', err);
    return new NextResponse('Service Unavailable: Database not configured.', { status: 503 });
  }

  try {
    const { error } = await supabase.from('leads').insert({ email });
    
    if (error) {
      // If email already registered (unique constraint violation), treat as success to avoid leaking/error page
      if (error.code === '23505') {
        return NextResponse.redirect(new URL('/?status=success', request.url), 303);
      }
      throw error;
    }

    return NextResponse.redirect(new URL('/?status=success', request.url), 303);
  } catch (error: any) {
    console.error('Early access registration failed:', error);
    const errorMessage = error?.message || JSON.stringify(error) || 'Unknown error';
    return new NextResponse(`Internal Server Error: Registration failed. Details: ${errorMessage}`, { status: 500 });
  }
}
