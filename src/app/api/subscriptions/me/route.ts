import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getAuthUser, getBearerToken } from '@/lib/auth-helper'

export async function GET(request: NextRequest) {
  try {
    const supabase = await dbConnect(getBearerToken(request))
    const token = await getAuthUser(request)
    if (!token || !token.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('subscriptions')
      .select('id,planId,planName,status,startedAt,currentPeriodEnd')
      .eq('user', token.sub)
      .eq('status', 'active')
      .lte('startedAt', new Date().toISOString())
      .gt('currentPeriodEnd', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
    if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })
    const sub = data && data.length > 0 ? data[0] : null
    return NextResponse.json({ ok: true, subscription: sub }, { headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' } })
  } catch (err) {
    console.error('[api/subscriptions/me] error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
