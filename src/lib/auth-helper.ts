import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

export function getBearerToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  return match?.[1] ?? null
}

export async function getAuthUser(req: NextRequest) {
  const token = getBearerToken(req)
  if (!token) return null

  // En modo mock los tokens tienen el formato "mock-token-{userId}"
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    const match = token.match(/^mock-token-(.+)$/)
    if (match) return { sub: match[1], email: 'mock@test.cl' }
    return null
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return { sub: user.id, email: user.email }
}
