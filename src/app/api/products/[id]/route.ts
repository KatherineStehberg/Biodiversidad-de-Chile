import { NextRequest, NextResponse } from 'next/server'
import { getErrorMessage } from '@/lib/utils'
import dbConnect from '@/lib/db'
import { getAuthUser, getBearerToken } from '@/lib/auth-helper'

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
    const res = await supabase.from('products').select('id,title,description,price,category,images,seller_id,country,city,is_approved,created_at').eq('is_approved', true).eq('id', id).single()
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
      const sellerRes = await supabase.from('public_profiles').select('id,name,avatar').eq('id', product.seller_id).single()
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
    const supabase = await dbConnect()
    const user = await getAuthUser(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const db = await dbConnect(getBearerToken(request))
    const source = await request.json()
    const body = Object.fromEntries(['title','description','price','category','images','country','city'].filter(key => key in source).map(key => [key, source[key]]))
    const updateRes = await db.from('products').update({ ...body, is_approved: false }).eq('seller_id', user.sub).eq('id', id).select('id,title,description,price,category,images,seller_id,country,city,is_approved,created_at').single()
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
    const db = await dbConnect(getBearerToken(request))
    const delRes = await db.from('products').delete({ count: 'exact' }).eq('seller_id', user.sub).eq('id', id)
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
