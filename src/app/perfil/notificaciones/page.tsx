'use client'

import { useState } from 'react'
import ProfileLayout from '@/components/layout/ProfileLayout'

const NOTIFICATION_OPTIONS = [
  { id: 'nuevas_ofertas', label: 'Nuevas ofertas laborales', description: 'Notificaciones cuando se publican ofertas en tu especialidad' },
  { id: 'mensajes', label: 'Mensajes de contacto', description: 'Cuando alguien te contacta a través de la plataforma' },
  { id: 'novedades', label: 'Novedades de la plataforma', description: 'Actualizaciones y nuevas funcionalidades' },
  { id: 'boletin', label: 'Boletín semanal', description: 'Resumen semanal de actividad ambiental en la comunidad' },
]

export default function NotificacionesPage() {
  return (
    <ProfileLayout>
      <NotificacionesForm />
    </ProfileLayout>
  )
}

function NotificacionesForm() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    nuevas_ofertas: true,
    mensajes: true,
    novedades: false,
    boletin: false,
  })
  const [saved, setSaved] = useState(false)

  function toggle(id: string) {
    setPrefs(p => ({ ...p, [id]: !p[id] }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Preferencias de notificaciones</h2>
        <p className="text-sm text-gray-400 mt-1">Elige qué notificaciones quieres recibir por correo.</p>
      </div>

      <div className="space-y-3">
        {NOTIFICATION_OPTIONS.map(opt => (
          <div
            key={opt.id}
            className="flex items-start justify-between gap-4 p-4 bg-neutral-800/50 rounded-lg border border-neutral-800 hover:border-neutral-700 transition"
          >
            <div>
              <div className="text-sm font-medium text-white">{opt.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{opt.description}</div>
            </div>
            <button
              type="button"
              onClick={() => toggle(opt.id)}
              className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
                prefs[opt.id] ? 'bg-green-600' : 'bg-neutral-600'
              }`}
              aria-checked={prefs[opt.id]}
              role="switch"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  prefs[opt.id] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
        >
          Guardar preferencias
        </button>
        {saved && (
          <span className="text-sm text-green-400">✓ Guardado</span>
        )}
      </div>
    </div>
  )
}
