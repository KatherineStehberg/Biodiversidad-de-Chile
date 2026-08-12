import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getAuthUser, getBearerToken } from '@/lib/auth-helper'
import { sendAdminNotification, sendAuthorNotification } from '@/lib/email'

interface UserToken {
  sub: string
  email?: string
}

interface AuthorUser {
  email?: string
}

const PUBLIC_CONSULTANT_FIELDS = 'id,especialidad,experiencia,cv_url,portfolio_url,certificaciones,verificado,isApproved,created_at'
const WRITABLE_FIELDS = ['especialidad', 'experiencia', 'cv_url', 'portfolio_url', 'certificaciones'] as const

function sanitizeConsultantBody(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null

  const source = body as Record<string, unknown>
  const sanitized: Record<string, string | null> = {}

  for (const field of WRITABLE_FIELDS) {
    if (!(field in source)) continue
    const value = source[field]
    if (value !== null && typeof value !== 'string') return null
    sanitized[field] = typeof value === 'string' ? value.trim() || null : null
  }

  return sanitized
}

export async function GET() {
  try {
    const supabase = await dbConnect()
    const { data, error } = await supabase
      .from('consultores')
      .select(PUBLIC_CONSULTANT_FIELDS)
      .eq('isApproved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching consultants:', error)
      return NextResponse.json({ error: 'Error fetching consultants' }, { status: 500 })
    }

    return NextResponse.json({ consultants: data })
  } catch (err) {
    console.error('[api/consultants GET] error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthUser(request)
    const userId = token?.sub
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const accessToken = getBearerToken(request)
    const supabase = await dbConnect(accessToken)
    const consultantData = sanitizeConsultantBody(await request.json())
    if (!consultantData) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const existingRes = await supabase.from('consultores').select('id').eq('usuario_id', userId).single()
    const existing = !existingRes.error ? existingRes.data : null
    const base = process.env.NEXTAUTH_URL || ''
    const secretParam = process.env.MODERATION_SECRET ? `&secret=${encodeURIComponent(process.env.MODERATION_SECRET)}` : ''

    if (existing) {
      const updateRes = await supabase
        .from('consultores')
        .update({ ...consultantData, isApproved: false })
        .eq('id', existing.id)
        .select(PUBLIC_CONSULTANT_FIELDS)
        .single()
      if (updateRes.error) return NextResponse.json({ error: 'Datos inválidos', details: updateRes.error.message }, { status: 400 })
      await supabase.from('usuarios').update({ rol: 'consultant' }).eq('id', userId)

      const approveUrl = `${base}/api/moderation/approve?type=consultant&id=${existing.id}${secretParam}`
      await sendAdminNotification({ subject: `Perfil de consultor a revisar: ${userId}`, text: `Revisar: ${approveUrl}` })
      try {
        let authorEmail: string | undefined = (token as UserToken).email
        if (!authorEmail) {
          const authorUser = await supabase.from('usuarios').select('email').eq('id', userId).single()
          const userData = authorUser.data as AuthorUser
          if (!authorUser.error && userData?.email) authorEmail = String(userData.email)
        }
        if (authorEmail) await sendAuthorNotification({ to: authorEmail, subject: 'Tu perfil de consultor fue enviado para revisión', text: 'Tu perfil fue actualizado y está pendiente de aprobación.' })
      } catch (error) {
        console.error('[api/consultants] author notification error', error)
      }

      return NextResponse.json({ ok: true, consultant: updateRes.data })
    }

    const insertRes = await supabase
      .from('consultores')
      .insert({ ...consultantData, usuario_id: userId, isApproved: false })
      .select(PUBLIC_CONSULTANT_FIELDS)
      .single()
    if (insertRes.error) return NextResponse.json({ error: 'Datos inválidos', details: insertRes.error.message }, { status: 400 })
    const consultant = insertRes.data
    await supabase.from('usuarios').update({ rol: 'consultant' }).eq('id', userId)

    const approveUrl = `${base}/api/moderation/approve?type=consultant&id=${consultant.id}${secretParam}`
    await sendAdminNotification({ subject: 'Nuevo perfil de consultor a revisar', text: `Revisar: ${approveUrl}` })
    try {
      let authorEmail: string | undefined = (token as UserToken).email
      if (!authorEmail) {
        const authorUser = await supabase.from('usuarios').select('email').eq('id', userId).single()
        const userData = authorUser.data as AuthorUser
        if (!authorUser.error && userData?.email) authorEmail = String(userData.email)
      }
      if (authorEmail) await sendAuthorNotification({ to: authorEmail, subject: 'Tu perfil fue enviado para revisión', text: 'Gracias, tu perfil de consultor está pendiente de aprobación.' })
    } catch (error) {
      console.error('[api/consultants] author notification error', error)
    }

    return NextResponse.json({ ok: true, consultant })
  } catch (err) {
    console.error('[api/consultants] error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
