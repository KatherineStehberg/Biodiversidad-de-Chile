'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function PagoExito() {
  const [state, setState] = useState<'loading' | 'active' | 'pending' | 'login'>('loading')
  const [plan, setPlan] = useState('')
  useEffect(() => {
    let alive = true
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { if (alive) setState('login'); return }
        const response = await fetch('/api/subscriptions/me', {
          headers: { Authorization: `Bearer ${session.access_token}` }, cache: 'no-store'
        })
        const data = await response.json()
        if (!alive) return
        if (response.ok && data.subscription) {
          setPlan(data.subscription.planName)
          setState('active')
        } else setState('pending')
      } catch { if (alive) setState('pending') }
    }
    void load()
    return () => { alive = false }
  }, [])
  return <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-950 text-white">
    <div className="max-w-lg text-center space-y-6">
      <h1 className="text-3xl font-bold">{state === 'active' ? 'Tu membresía está activa' : 'Estado de tu membresía'}</h1>
      <p aria-live="polite">{state === 'loading' ? 'Consultando el estado…' : state === 'active'
        ? `Plan ${plan}. Ya puedes acceder a los beneficios de tu membresía.`
        : state === 'login' ? 'Inicia sesión para consultar tu membresía.'
        : 'Todavía no aparece una membresía vigente. Si ya pagaste, espera unos minutos y vuelve a consultar. Evita repetir el pago.'}</p>
      <Link className="block text-green-400 underline" href={state === 'login' ? '/login' : '/dashboard'}>Ir a mi cuenta</Link>
      {state === 'pending' && <button onClick={() => window.location.reload()} className="rounded bg-green-700 p-3">Consultar de nuevo</button>}
      <Link className="block underline" href="/contact">Contactar a soporte</Link>
    </div>
  </main>
}
