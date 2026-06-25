'use client'

import { useState } from 'react'
import ProfileLayout from '@/components/layout/ProfileLayout'
import { supabase } from '@/lib/supabase'

export default function SeguridadPage() {
  return (
    <ProfileLayout>
      <SeguridadForm />
    </ProfileLayout>
  )
}

function SeguridadForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setIsError(true)
      setMessage('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setIsError(true)
      setMessage('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setSaving(true)
    setMessage('')
    setIsError(false)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMessage('Contraseña actualizada correctamente')
      setPassword('')
      setConfirm('')
    } catch (err: any) {
      setIsError(true)
      setMessage(err?.message || 'Error al actualizar la contraseña')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Cambiar contraseña</h2>
        <p className="text-sm text-gray-400 mt-1">Elige una contraseña segura de al menos 6 caracteres.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nueva contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 outline-none"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Confirmar contraseña</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 outline-none"
            placeholder="Repite la contraseña"
          />
        </div>

        {message && (
          <div className={`text-sm px-4 py-3 rounded-lg border ${
            isError
              ? 'bg-red-900/40 border-red-700 text-red-300'
              : 'bg-green-900/40 border-green-700 text-green-300'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </form>

      <div className="border-t border-neutral-800 pt-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Sesión activa</h3>
        <p className="text-xs text-gray-500">Tu sesión está activa en este dispositivo.</p>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = '/login'
          }}
          className="mt-3 text-sm text-red-400 hover:text-red-300 font-medium transition"
        >
          Cerrar sesión en todos los dispositivos
        </button>
      </div>
    </div>
  )
}
