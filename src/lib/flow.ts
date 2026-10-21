import 'server-only'
import { createHmac } from 'node:crypto'

export function paymentConfig() {
  const apiKey = process.env.FLOW_API_KEY
  const secretKey = process.env.FLOW_SECRET_KEY
  const environment = process.env.FLOW_ENVIRONMENT
  const site = process.env.NEXT_PUBLIC_SITE_URL
  if (!apiKey || !secretKey || !site || !['production', 'sandbox'].includes(environment || '')) {
    throw new Error('Configuración de pagos incompleta')
  }
  const siteUrl = new URL(site)
  if (siteUrl.username || siteUrl.password || siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash) {
    throw new Error('La URL del portal debe ser un origen sin rutas')
  }
  const origin = siteUrl.origin
  if (!origin.startsWith('https://')) throw new Error('Los pagos requieren HTTPS')
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') throw new Error('Pagos no disponibles en modo demo')
  return { apiKey, secretKey, origin,
    base: environment === 'production' ? 'https://www.flow.cl/api' : 'https://sandbox.flow.cl/api' }
}

export async function flowRequest<T>(path: string, values: Record<string, string>, method: 'GET' | 'POST') {
  const config = paymentConfig()
  const params: Record<string, string> = { ...values, apiKey: config.apiKey }
  const signed = Object.keys(params).sort().map(key => key + params[key]).join('')
  params.s = createHmac('sha256', config.secretKey).update(signed).digest('hex')
  const body = new URLSearchParams(params)
  const response = await fetch(`${config.base}/${path}${method === 'GET' ? `?${body}` : ''}`, {
    method, cache: 'no-store', signal: AbortSignal.timeout(15000),
    ...(method === 'POST' ? { body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } : {})
  })
  if (!response.ok) throw new Error('Flow no pudo procesar la solicitud')
  return await response.json() as T
}
