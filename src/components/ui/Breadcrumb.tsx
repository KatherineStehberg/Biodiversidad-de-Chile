'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiChevronRight, HiHome } from 'react-icons/hi'

const LABELS: Record<string, string> = {
  consultores: 'Consultores',
  marketplace: 'Marketplace',
  educacion: 'Educación',
  dashboard: 'Mi Panel',
  perfil: 'Perfil',
  profesional: 'Datos Profesionales',
  seguridad: 'Seguridad',
  notificaciones: 'Notificaciones',
  'mis-publicaciones': 'Mis Publicaciones',
  membresias: 'Membresías',
  campanas: 'Campañas',
  landing: 'Diagnóstico',
  contact: 'Contacto',
  pago: 'Pago',
  exito: 'Pago exitoso',
  fallo: 'Error de pago',
  terms: 'Términos y condiciones',
  privacy: 'Privacidad',
  'reset-password': 'Cambiar contraseña',
}

const HIDDEN_ON = ['/', '/landing']

export default function Breadcrumb() {
  const pathname = usePathname()

  if (HIDDEN_ON.includes(pathname)) return null

  const segments = pathname.split('/').filter(Boolean)
  const crumbs = segments.map((seg, i) => ({
    href: '/' + segments.slice(0, i + 1).join('/'),
    label: LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
  }))

  return (
    <nav aria-label="Breadcrumb" className="bg-neutral-950/80 border-b border-white/5 px-6 py-2">
      <ol className="max-w-7xl mx-auto flex items-center gap-1 text-sm text-gray-400 flex-wrap">
        <li>
          <Link href="/" className="hover:text-white transition flex items-center" aria-label="Inicio">
            <HiHome className="size-4" />
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <HiChevronRight className="size-3 text-gray-600 shrink-0" />
            {i === crumbs.length - 1 ? (
              <span className="text-white font-medium">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-white transition truncate max-w-[120px]">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
