import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // We don't throw here to avoid breaking the build, but auth will not work without these.
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) are not set.')
}


export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

