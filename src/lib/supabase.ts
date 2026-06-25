import { createClient } from '@supabase/supabase-js'
import { mockSupabase } from './mock-supabase'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

const realSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export const supabase: any = USE_MOCK ? mockSupabase : realSupabase
