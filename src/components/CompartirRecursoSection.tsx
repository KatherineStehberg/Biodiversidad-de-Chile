'use client'

import { useState } from 'react'
import ProtectedAction from './ProtectedAction'
import { supabase } from '@/lib/supabase'
import { getErrorMessage } from '@/lib/utils'

function CompartirForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ title, description, link })
      })
      if (!res.ok) throw new Error((await res.json())?.error || 'Error')
      setStatus('sent')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo enviar'))
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="text-center py-4 space-y-3">
        <div className="text-4xl">✅</div>
        <p className="text-white font-semibold">Recurso enviado para revisión</p>
        <p className="text-gray-300 text-sm">Lo revisaremos y lo publicaremos pronto.</p>
        <button onClick={onClose} className="mt-2 text-sm text-gray-400 hover:text-white">Cerrar</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Título del recurso</label>
        <input
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 text-white"
          placeholder="Ej: Guía de compostaje urbano"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Descripción</label>
        <textarea
          required
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 text-white resize-none"
          placeholder="Describe de qué trata el recurso..."
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Link o URL</label>
        <input
          type="url"
          value={link}
          onChange={e => setLink(e.target.value)}
          className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 text-white"
          placeholder="https://..."
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
        >
          {status === 'sending' ? 'Enviando...' : 'Compartir recurso'}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function CompartirRecursoSection() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section className="bg-green-700 py-12 text-white text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="text-4xl">🏫</div>
          <h3 className="text-2xl font-semibold">¿Tienes material educativo?</h3>
          <p>ONGs, docentes y organizaciones pueden compartir sus recursos con la comunidad.</p>
          <ProtectedAction fallback={
            <span className="inline-block bg-white text-green-700 font-semibold px-6 py-2 rounded opacity-50 cursor-not-allowed">
              + Compartir recurso
            </span>
          }>
            <button
              onClick={() => setOpen(true)}
              className="inline-block bg-white text-green-700 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition"
            >
              + Compartir recurso
            </button>
          </ProtectedAction>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-neutral-900 text-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold">Compartir recurso educativo</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <CompartirForm onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
