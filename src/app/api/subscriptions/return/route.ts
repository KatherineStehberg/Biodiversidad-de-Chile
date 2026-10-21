import { NextResponse } from 'next/server'
import { confirmFlowPayment, readFlowToken } from '@/lib/confirm-flow-payment'
import { paymentConfig } from '@/lib/flow'

export const runtime = 'nodejs'
export async function POST(request: Request) {
  const { origin } = paymentConfig()
  try {
    const status = await confirmFlowPayment(await readFlowToken(request))
    return NextResponse.redirect(new URL(status === 2 ? '/membresias/pago/exito' : '/membresias/pago/fallo', origin), 303)
  } catch {
    return NextResponse.redirect(new URL('/membresias/pago/fallo', origin), 303)
  }
}
