'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server' 

export async function login(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=البريد الإلكتروني أو كلمة المرور غير صحيحة')
  }

  revalidatePath('/', 'layout')
  redirect('/tools')
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?message=${error.message}`)
  }

  revalidatePath('/', 'layout')
  redirect('/tools') 
}