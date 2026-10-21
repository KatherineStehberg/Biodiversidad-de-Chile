import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, getBearerToken } from '@/lib/auth-helper'
import dbConnect from '@/lib/db'

export async function GET(request: NextRequest) {
  const headers = { 'Cache-Control': 'private, no-store', Vary: 'Authorization' }
  try {
    if (!await getAuthUser(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    const kind = request.nextUrl.searchParams.get('kind')
    const id = request.nextUrl.searchParams.get('id')
    if (!['offer', 'consultant'].includes(kind || '') || !id || !/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers })
    }
    const db = await dbConnect(getBearerToken(request))
    // The RPC enforces active membership and moderation even on direct Supabase calls.
    const { data, error } = await db.rpc('membership_contact', { resource_kind: kind, resource_id: id })
    if (error) return NextResponse.json({ error: 'Contacto no disponible' }, { status: 403, headers })
    return NextResponse.json({ contact: data }, { headers })
  } catch {
    return NextResponse.json({ error: 'Contacto no disponible' }, { status: 503, headers })
  }
}
