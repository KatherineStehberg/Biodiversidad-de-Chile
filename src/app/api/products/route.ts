import { NextRequest, NextResponse } from 'next/server'
import { getErrorMessage } from '@/lib/utils'
import dbConnect from '@/lib/db'
import { getAuthUser, getBearerToken } from '@/lib/auth-helper'
import { sendAdminNotification, sendAuthorNotification } from '@/lib/email'

interface SellerRow {
  id: string
  name: string | null
  email: string
  imagen_perfil: string | null
}

function sanitizeProductBody(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const source = body as Record<string, unknown>

  const title = typeof source.title === 'string' ? source.title.trim() : ''
  const description = typeof source.description === 'string' ? source.description.trim() : ''
  const category = typeof source.category === 'string' ? source.category.trim() : ''
  const country = typeof source.country === 'string' ? source.country.trim() : ''
  const city = typeof source.city === 'string' ? source.city.trim() : ''
  const price = typeof source.price === 'number' ? source.price : Number(source.price)
  const images = Array.isArray(source.images)
    ? source.images.filter((value): value is string => typeof value === 'string')
    : []

  if (!title || !description || !category || !country || !city) return null
  if (!Number.isFinite(price) || price < 0) return null

  return { title, description, price, category, images, country, city }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthUser(request)
    const userId = token?.sub
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const productData = sanitizeProductBody(await request.json())
    if (!productData) {
      return NextResponse.json({ error: 'Datos de producto inválidos' }, { status: 400 })
    }

    const accessToken = getBearerToken(request)
    const supabase = await dbConnect(accessToken)
    const insertRes = await supabase
      .from('products')
      .insert({ ...productData, seller_id: userId, is_approved: false })
      .select('id,title,description,price,category,images,country,city,seller_id,is_approved,created_at')
      .single()

    if (insertRes.error) {
      return NextResponse.json({ error: 'Datos de producto inválidos', details: insertRes.error.message }, { status: 400 })
    }

    const product = insertRes.data
    let seller = null
    const sellerRes = await supabase
      .from('usuarios')
      .select('id,name,email,imagen_perfil')
      .eq('id', userId)
      .single()
    if (!sellerRes.error && sellerRes.data) {
      const row = sellerRes.data as SellerRow
      seller = {
        id: row.id,
        name: row.name || '',
        email: row.email,
        avatar: row.imagen_perfil || '',
      }
    }

    const base = process.env.NEXTAUTH_URL || ''
    const secretParam = process.env.MODERATION_SECRET ? `&secret=${encodeURIComponent(process.env.MODERATION_SECRET)}` : ''
    const approveUrl = `${base}/api/moderation/approve?type=product&id=${product.id}${secretParam}`
    await sendAdminNotification({ subject: `Nuevo producto a revisar: ${product.title}`, text: `Revisar: ${approveUrl}` })

    if (token.email) {
      await sendAuthorNotification({ to: token.email, subject: 'Tu producto fue enviado para revisión', text: `Gracias, tu producto '${product.title}' está pendiente de aprobación.` })
    }

    return NextResponse.json({ ...product, seller }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Error interno del servidor') },
      { status: 500 }
    )
  }
}
