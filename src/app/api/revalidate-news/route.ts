import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/revalidate-news?secret=TU_SECRETO
// Configura este endpoint como webhook en WordPress (plugin WP Webhooks o similar)
// para que se llame automáticamente cada vez que publiques un post.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag('biodiversidad-posts')

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() })
}

// GET para verificar que el endpoint está activo
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  revalidateTag('biodiversidad-posts')
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() })
}
