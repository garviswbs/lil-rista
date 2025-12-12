import { createClient } from '@supabase/supabase-js'

// These will need to be set as environment variables
// For now, using placeholder values that you'll need to replace
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be set in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

