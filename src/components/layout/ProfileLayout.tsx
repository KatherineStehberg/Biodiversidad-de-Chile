'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import PointsBadge from '@/components/ui/PointsBadge'

interface UserMetadata {
  name?: string
  full_name?: string
  avatar_url?: string
  picture?: string
}

interface UserIdentity {
  identity_data?: {
    name?: string
    full_name?: string
    avatar_url?: string
    picture?: string
  }
}

const NAV_ITEMS = [
  { href: '/perfil', label: 'Información General' },
  { href: '/perfil/profesional', label: 'Datos Profesionales' },
  { href: '/perfil/seguridad', label: 'Seguridad' },
  { href: '/perfil/notificaciones', label: 'Notificaciones' },
]

const BOTTOM_ITEMS = [
  { href: '/mis-publicaciones', label: 'Mis Publicaciones' },
  { href: '/membresias', label: 'Membresía' },
  { href: '/dashboard', label: 'Mi Panel' },
]

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!active) return
      if (!data.session) {
        router.push('/login')
        return
      }
      setUser(data.session.user)
      setLoading(false)
    })()
    return () => { active = false }
  }, [router])

  if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Cargando perfil...</div>
  if (!user) return null

  const meta = (user.user_metadata || {}) as UserMetadata
  const identities = (user.identities || []) as unknown as UserIdentity[]
  const identity = identities.length > 0 ? identities[0].identity_data || {} : {}
  const name = meta.name || meta.full_name || identity.name || identity.full_name || user.email?.split('@')[0] || 'Usuario'
  const avatar = meta.avatar_url || meta.picture || identity.avatar_url || identity.picture || null

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* User header */}
        <div className="mb-8 flex items-center gap-4">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-green-600" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-700 grid place-items-center text-xl font-bold text-white">
              {name[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{name}</h1>
            <p className="text-gray-400 text-sm mb-1">{user.email}</p>
            <PointsBadge />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Sidebar nav */}
          <aside className="md:col-span-1">
            <nav className="flex flex-col gap-1 text-sm">
              {NAV_ITEMS.map(item => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg transition ${
                      isActive
                        ? 'bg-green-700/20 text-green-300 font-medium border border-green-700/30'
                        : 'text-gray-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}

              <div className="my-3 border-t border-neutral-800" />

              {BOTTOM_ITEMS.map(item => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg transition ${
                      isActive
                        ? 'bg-green-700/20 text-green-300 font-medium border border-green-700/30'
                        : 'text-gray-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="md:col-span-3">
            {children}
          </main>

        </div>
      </div>
    </div>
  )
}
