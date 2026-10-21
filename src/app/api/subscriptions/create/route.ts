import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth-helper'
import { MEMBERSHIP_PLANS, type PaidPlanId } from '@/lib/membership-plans'
import { paymentConfig, flowRequest } from '@/lib/flow'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user?.sub || !user.email) return NextResponse.json({ error: 'Inicia sesión para continuar' }, { status: 401 })
    const { planId } = await request.json()
    if (typeof planId !== 'string' || !Object.hasOwn(MEMBERSHIP_PLANS, planId)) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 })
    }
    const plan = MEMBERSHIP_PLANS[planId as PaidPlanId]
    const { origin } = paymentConfig()
    const db = supabaseAdmin()
    // Cada intento tiene su propia orden. Nunca se acepta monto ni usuario desde el navegador.
    const id = randomUUID()
    const { error } = await db.from('subscriptions').insert({
      id, user: user.sub, planId, planName: plan.name, price: plan.price, currency: 'CLP', status: 'pending'
    })
    if (error) throw new Error('No se pudo registrar la orden')
    const result = await flowRequest<{ url: string; token: string; flowOrder: number }>('payment/create', {
      commerceOrder: id, subject: `Membresía ${plan.name} — 1 mes`, currency: 'CLP',
      amount: String(plan.price), email: user.email,
      urlConfirmation: `${origin}/api/subscriptions/webhook`, urlReturn: `${origin}/api/subscriptions/return`
    }, 'POST')
    const checkout = new URL(result.url)
    if (checkout.protocol !== 'https:' || !(checkout.hostname === 'flow.cl' || checkout.hostname.endsWith('.flow.cl')) || !result.token) {
      throw new Error('Respuesta de pago inválida')
    }
    checkout.searchParams.set('token', result.token)
    return NextResponse.json({ checkoutUrl: checkout.toString() })
  } catch {
    return NextResponse.json({ error: 'No se pudo iniciar el pago. Intenta más tarde o contacta a soporte.' }, { status: 503 })
  }
}
