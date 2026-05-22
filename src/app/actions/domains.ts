'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addDomain(formData: FormData) {
  const supabase = await createClient()
  const domainUrl = formData.get('domainUrl') as string

  if (!domainUrl) {
    return { error: 'Domain URL is required' }
  }

  // Ensure URL is properly formatted
  let formattedUrl = domainUrl
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('domains').insert({
    user_id: user.id,
    domain_url: formattedUrl,
    status: 'pending'
  })

  if (error) {
    console.error('Error adding domain:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteDomain(domainId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Supabase RLS will ensure user can only delete their own domain
  const { error } = await supabase.from('domains').delete().eq('id', domainId).eq('user_id', user.id)
  
  if (error) {
    console.error('Error deleting domain:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

import { countTokens } from '@/lib/tokenizer'

export async function getLlmsFile(domainId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify ownership of the domain
  const { data: domain } = await supabase
    .from('domains')
    .select('id')
    .eq('id', domainId)
    .eq('user_id', user.id)
    .single()

  if (!domain) return { error: 'Domain not found or access denied' }

  const { data, error } = await supabase
    .from('llms_files')
    .select('content')
    .eq('domain_id', domainId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching llms file:', error)
    return { error: error.message }
  }

  return { content: data?.content || '' }
}

export async function updateLlmsFile(domainId: string, content: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify ownership of the domain
  const { data: domain } = await supabase
    .from('domains')
    .select('id')
    .eq('id', domainId)
    .eq('user_id', user.id)
    .single()

  if (!domain) return { error: 'Domain not found or access denied' }

  const tokenCount = countTokens(content)

  const { error } = await supabase.from('llms_files').upsert({
    domain_id: domainId,
    content,
    token_count: tokenCount,
    last_updated: new Date().toISOString()
  }, { onConflict: 'domain_id' })

  if (error) {
    console.error('Error updating llms file:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
