import { NextResponse } from 'next/server'
import { confirmFlowPayment, readFlowToken } from '@/lib/confirm-flow-payment'

export const runtime = 'nodejs'
export async function POST(request: Request) {
  try {
    await confirmFlowPayment(await readFlowToken(request))
    return NextResponse.json({ ok: true })
  } catch {
    // No confirmar recepción si falló la verificación o persistencia: Flow puede reintentar.
    return NextResponse.json({ error: 'No se pudo confirmar el pago' }, { status: 503 })
  }
}
