import { NextRequest, NextResponse } from 'next/server'
import { getErrorMessage } from '@/lib/utils'
import dbConnect from '@/lib/db'
import { getAuthUser, getBearerToken } from '@/lib/auth-helper'
import { sendAdminNotification } from '@/lib/email'

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  seller_id: string
  created_at: string
  is_approved: boolean
  country?: string
  city?: string
}

interface Seller {
  id: string
  name: string
  avatar: string
  bio?: string
}

// GET /api/products/[id] - Obtener producto específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await dbConnect()
    const res = await supabase.from('products').select('*').eq('id', id).single()
    if (res.error && res.error.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
    }
    const product = res.data as Product | null

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' }, 
        { status: 404 }
      )
    }

    let seller: Seller | null = null
    if (product && product.seller_id) {
      const sellerRes = await supabase.from('public_profiles').select('id,name,avatar,bio').eq('id', product.seller_id).single()
      if (!sellerRes.error && sellerRes.data) seller = sellerRes.data as Seller
    }

    return NextResponse.json(product ? { ...product, seller } : null)

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getAuthUser(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = await dbConnect(getBearerToken(request))
    const { title, description, price, category, images, country, city } = await request.json()
    const updateRes = await supabase.from('products').update({ title, description, price, category, images, country, city }).eq('id', id).select('*').single()
    if (updateRes.error) {
      return NextResponse.json({ error: 'Datos de producto inválidos', details: updateRes.error.message }, { status: 400 })
    }
    const product = updateRes.data as Product | null
    let seller: Seller | null = null
    if (product && product.seller_id) {
      const sellerRes = await supabase.from('public_profiles').select('id,name,avatar').eq('id', product.seller_id).single()
      if (!sellerRes.error && sellerRes.data) seller = sellerRes.data as Seller
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' }, 
        { status: 404 }
      )
    }

    const base = process.env.NEXTAUTH_URL || ''
    const secret = process.env.MODERATION_SECRET
    const secretParam = secret ? `&secret=${encodeURIComponent(secret)}` : ''
    const approveUrl = `${base}/api/moderation/approve?type=product&id=${product.id}${secretParam}`
    await sendAdminNotification({ subject: `Producto editado a revisar: ${product.title}`, text: `Revisar: ${approveUrl}` })

    return NextResponse.json({ ...product, seller })

  } catch (error) {
    console.error('Error updating product:', error)
    
    return NextResponse.json(
      { error: getErrorMessage(error, 'Error interno del servidor') }, 
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getAuthUser(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = await dbConnect(getBearerToken(request))
    const delRes = await supabase.from('products').delete({ count: 'exact' }).eq('id', id)
    if (delRes.error) {
      return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
    }
    const count = delRes.count ?? null

    if (count === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Producto eliminado exitosamente' })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}
