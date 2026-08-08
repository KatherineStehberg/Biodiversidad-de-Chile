import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getAuthUser, getBearerToken } from '@/lib/auth-helper'

export async function POST(req: NextRequest) {
  try {
    const token = await getAuthUser(req)
    const accessToken = getBearerToken(req)

    let userId: string | undefined = undefined
    if (token && token.sub) {
      userId = token.sub
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      name, address, role,
      especialidad, experiencia, cv_url, portfolio_url, certificaciones,
      linkedin_url, instagram_url, facebook_url, tiktok_url,
    } = body
    const supabase = await dbConnect(accessToken)

    const clean = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? null : v)

    const ROLE_MAP: Record<string, string> = {
      'Usuario': 'usuario_regular',
      'Consultor': 'consultor',
      'user': 'usuario_regular',
      'consultant': 'consultor',
      'usuario_regular': 'usuario_regular',
      'reclutador': 'reclutador',
      'consultor': 'consultor',
      'admin': 'admin'
    }

    let safeRole: string | undefined = undefined

    const updates: Record<string, unknown> = {
      id: userId,
      email: token?.email,
      updated_at: new Date().toISOString()
    }

    if (name !== undefined) updates.name = clean(name)
    if (address !== undefined) updates.address = clean(address)
    if (role !== undefined) {
      safeRole = ROLE_MAP[role] || 'usuario_regular'
      updates.tipo_usuario = clean(safeRole)
    }
    if (linkedin_url !== undefined) updates.linkedin_url = clean(linkedin_url)
    if (instagram_url !== undefined) updates.instagram_url = clean(instagram_url)
    if (facebook_url !== undefined) updates.facebook_url = clean(facebook_url)
    if (tiktok_url !== undefined) updates.tiktok_url = clean(tiktok_url)

    const { data, error } = await supabase
      .from('usuarios')
      .upsert(updates, { onConflict: 'email' })
      .select('id, email, name')
      .single()

    if (error) {
      console.error('DB Error updating usuarios table:', error)
      return NextResponse.json({ error: 'DB error', details: error.message }, { status: 500 })
    }
    if (!data) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (safeRole === 'consultor') {
      const { data: existing, error: searchError } = await supabase
        .from('consultores')
        .select('id')
        .eq('usuario_id', data.id)
        .single()

      if (searchError && searchError.code !== 'PGRST116') {
        console.error('Error searching consultant:', searchError)
      }

      const consultantData: Record<string, unknown> = {
        usuario_id: data.id,
        especialidad: especialidad || 'General',
        experiencia: experiencia || 'Perfil de consultor',
        cv_url: cv_url || '',
        certificaciones: certificaciones || '',
        verificado: false
      }
      if (portfolio_url !== undefined) consultantData.portfolio_url = clean(portfolio_url)

      if (!existing) {
        const { error: insertError } = await supabase.from('consultores').insert(consultantData)
        if (insertError) {
          console.error('Error creating consultant profile:', insertError)
          return NextResponse.json({ error: 'Error creating consultant', details: insertError.message }, { status: 500 })
        }
      } else {
        const updateData: Record<string, unknown> = {}
        if (especialidad) updateData.especialidad = especialidad
        if (experiencia) updateData.experiencia = experiencia
        if (cv_url !== undefined) updateData.cv_url = cv_url
        if (portfolio_url !== undefined) updateData.portfolio_url = clean(portfolio_url)
        if (certificaciones !== undefined) updateData.certificaciones = certificaciones

        if (Object.keys(updateData).length > 0) {
          const { error: updateError } = await supabase
            .from('consultores')
            .update(updateData)
            .eq('id', existing.id)

          if (updateError) {
            console.error('Error updating consultant profile:', updateError)
            return NextResponse.json({ error: 'Error updating consultant', details: updateError.message }, { status: 500 })
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error updating profile:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
