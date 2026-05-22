import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase client credentials are missing in the browser environment.')
  }

  return createBrowserClient(
    supabaseUrl || '',
    supabaseKey || ''
  )
}
