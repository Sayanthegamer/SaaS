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
