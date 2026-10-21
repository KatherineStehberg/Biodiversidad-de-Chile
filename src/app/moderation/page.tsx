'use client'
import { useEffect, useState } from 'react'

export default function ModerationPage() {
  const [secret, setSecret] = useState('')
  const [target, setTarget] = useState({ type: '', id: '' })
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  useEffect(() => {
    const url = new URL(window.location.href)
    setSecret(new URLSearchParams(url.hash.slice(1)).get('secret') || '')
    setTarget({ type: url.searchParams.get('type') || '', id: url.searchParams.get('id') || '' })
    window.history.replaceState(null, '', url.pathname + url.search)
  }, [])
  async function decide(action: 'approve' | 'reject') {
    setPending(true)
    setMessage('')
    try {
      const response = await fetch(`/api/moderation/${action}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...target, secret })
      })
      if (!response.ok) throw new Error('No se pudo guardar. Revisa el acceso y la configuración de moderación.')
      setSecret('')
      setMessage(action === 'approve' ? 'Publicación aprobada.' : 'Publicación rechazada y eliminada.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Error de moderación') }
    finally { setPending(false) }
  }
  return <main className="max-w-xl mx-auto min-h-screen p-8 space-y-6 text-white">
    <h1 className="text-2xl font-bold">Moderar publicación</h1>
    <p>Tipo: {target.type}. Identificador: {target.id}.</p>
    <p>Revisa el contenido en Supabase con tu acceso de administración antes de decidir. Rechazar elimina esta publicación.</p>
    <label className="block">Clave de moderación
      <input type="password" value={secret} onChange={event => setSecret(event.target.value)} className="block bg-neutral-800 p-2 w-full" />
    </label>
    <button disabled={pending || !secret} onClick={() => void decide('approve')} className="bg-green-700 rounded p-3 disabled:opacity-50">Aprobar</button>
    <button disabled={pending || !secret} onClick={() => void decide('reject')} className="bg-red-800 rounded p-3 ml-4 disabled:opacity-50">Rechazar y eliminar</button>
    <p role="status">{message}</p>
  </main>
}
