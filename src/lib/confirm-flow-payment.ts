import 'server-only'
import { flowRequest } from './flow'
import { supabaseAdmin } from './supabase-admin'

export async function confirmFlowPayment(token: string) {
  const payment = await flowRequest<{
    commerceOrder: string; flowOrder: number; status: number; amount: number; currency: string
  }>('payment/getStatus', { token }, 'GET')
  if (!payment.commerceOrder || !Number.isSafeInteger(payment.flowOrder) || payment.flowOrder <= 0 ||
      !Number.isFinite(payment.amount) || payment.amount <= 0 || payment.currency !== 'CLP' ||
      ![1, 2, 3, 4].includes(payment.status)) {
    throw new Error('Estado de pago inválido')
  }
  // La función SQL valida orden/monto/moneda, bloquea la fila y activa una sola vez.
  const { error } = await supabaseAdmin().rpc('confirm_flow_payment', {
    order_id: payment.commerceOrder, flow_order: String(payment.flowOrder),
    paid_amount: payment.amount, paid_currency: payment.currency, payment_status: payment.status
  })
  if (error) throw new Error('No se pudo confirmar la orden')
  return payment.status
}

export async function readFlowToken(request: Request) {
  const form = await request.formData()
  const token = form.get('token')
  if (typeof token !== 'string' || !token || token.length > 512) throw new Error('Token inválido')
  return token
}
