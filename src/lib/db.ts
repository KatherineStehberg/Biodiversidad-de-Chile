import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export async function dbConnect(accessToken?: string | null) {
  if (accessToken && process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'true') {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    })
  }

  return supabase
}

export function dbConnectAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')

  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export default dbConnect
