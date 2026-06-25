'use client'

import Link from 'next/link'
import { useContactAccess } from '@/hooks/useContactAccess'

interface Props {
  children: React.ReactNode
}

export default function ContactGate({ children }: Props) {
  const access = useContactAccess()

  if (access === 'loading') {
    return (
      <div className="pt-4 border-t border-neutral-800 space-y-2">
        <div className="h-4 bg-neutral-800 rounded animate-pulse w-1/2" />
        <div className="h-11 bg-neutral-800 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (access === 'no-session') {
    return (
      <div className="pt-4 border-t border-neutral-800 space-y-3">
        <p className="text-sm text-gray-400 text-center">
          Inicia sesión para ver la información de contacto
        </p>
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/registro"
          className="flex items-center justify-center w-full bg-neutral-800 hover:bg-neutral-700 text-gray-300 text-sm py-2.5 rounded-xl transition"
        >
          Crear cuenta gratis
        </Link>
      </div>
    )
  }

  if (access === 'no-membership') {
    return (
      <div className="pt-4 border-t border-neutral-800 space-y-3">
        <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-4">
          <p className="text-amber-300 font-semibold text-sm mb-1">🔒 Requiere membresía activa</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            El contacto directo es exclusivo para miembros de la plataforma.
            Suscríbete para acceder a esta información.
          </p>
        </div>
        <Link
          href="/membresias"
          className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 rounded-xl transition"
        >
          Ver planes de membresía →
        </Link>
      </div>
    )
  }

  // allowed
  return (
    <div className="pt-4 border-t border-neutral-800">
      {children}
    </div>
  )
}
