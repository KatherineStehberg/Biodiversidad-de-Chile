import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, getBearerToken } from '@/lib/auth-helper'
import dbConnect from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const accessToken = getBearerToken(request)
    const supabase = await dbConnect(accessToken)

    const body = await request.json()
    const { title, description, link } = body

    if (!title?.trim()) return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 })
    if (!description?.trim()) return NextResponse.json({ error: 'La descripción es obligatoria' }, { status: 400 })

    const { data, error } = await supabase
      .from('resources')
      .insert({
        title: title.trim(),
        description: description.trim(),
        link: link?.trim() || null,
        isActive: false,
        author_id: user.sub
      })
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true, id: data.id })
  } catch (err) {
    console.error('[api/resources] error', err)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
