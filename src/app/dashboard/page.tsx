'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import GamificationPanel from '@/components/ui/GamificationPanel'

interface UserData {
  name: string
  tipo_usuario: string
  imagen_perfil?: string
  especialidad?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }

        setEmail(session.user.email || '')

        const { data } = await supabase
          .from('usuarios')
          .select('name,tipo_usuario,imagen_perfil,especialidad')
          .eq('id', session.user.id)
          .single()

        if (data) {
          setUserData(data)
        } else {
          const meta = session.user.user_metadata || {}
          setUserData({
            name: meta.name || meta.full_name || session.user.email?.split('@')[0] || 'Usuario',
            tipo_usuario: 'usuario_regular',
            imagen_perfil: meta.avatar_url || meta.picture
          })
        }
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isConsultant = ['consultor', 'consultant'].includes(userData?.tipo_usuario || '')
  const name = userData?.name || email.split('@')[0] || 'Usuario'
  const firstName = name.split(' ')[0]

  return (
    <div className="min-h-screen bg-neutral-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Hola, {firstName} 👋</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {isConsultant ? 'Panel de consultor ambiental' : 'Panel de usuario'}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/perfil"
              className="text-sm px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition border border-neutral-700"
            >
              Editar perfil
            </Link>
            {isConsultant && (
              <Link
                href="/perfil/profesional"
                className="text-sm px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition"
              >
                Datos profesionales
              </Link>
            )}
          </div>
        </div>

        {/* Role badge */}
        <div className="mb-8">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
            isConsultant
              ? 'bg-green-900/30 text-green-300 border-green-700/40'
              : 'bg-neutral-800 text-gray-300 border-neutral-700'
          }`}>
            {isConsultant ? '🌿 Consultor ambiental' : '👤 Usuario / Reclutador'}
          </span>
          {isConsultant && userData?.especialidad && (
            <span className="ml-2 text-sm text-gray-500">· {userData.especialidad}</span>
          )}
        </div>

        {isConsultant ? <ConsultantDashboard /> : <UserDashboard />}

        {/* Gamificación */}
        <div className="mt-8">
          <h2 className="text-white font-semibold text-lg mb-4">Tu progreso en la comunidad</h2>
          <GamificationPanel />
        </div>

      </div>
    </div>
  )
}

function ConsultantDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon="🌿" label="Visibilidad" value="Activo"
          sub="Apareces en la red" color="green"
          href="/consultores"
        />
        <StatCard
          icon="📋" label="Publicaciones" value="Mis ofertas"
          sub="Convocatorias enviadas" color="blue"
          href="/mis-publicaciones"
        />
        <StatCard
          icon="💎" label="Membresía" value="Ver planes"
          sub="Aumentar visibilidad" color="purple"
          href="/membresias"
        />
      </div>

      <h2 className="text-white font-semibold text-lg pt-2">Acciones rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionCard
          icon="👥"
          title="Mi perfil en la red"
          description="Tu especialidad y experiencia son visibles para empresas que buscan consultores."
          href="/consultores"
          cta="Ver red de consultores"
        />
        <ActionCard
          icon="📝"
          title="Completar perfil profesional"
          description="Agrega tu especialidad, CV y certificaciones para destacar en la red."
          href="/perfil/profesional"
          cta="Editar datos profesionales"
        />
        <ActionCard
          icon="💼"
          title="Ofertas laborales"
          description="Revisa las convocatorias publicadas por empresas e instituciones."
          href="/consultores"
          cta="Ver ofertas activas"
        />
        <ActionCard
          icon="🎓"
          title="Recursos educativos"
          description="Comparte o accede a material técnico de la comunidad ambiental."
          href="/educacion"
          cta="Ir a Educación"
        />
      </div>
    </div>
  )
}

function UserDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon="💼" label="Mis publicaciones" value="Ver historial"
          sub="Ofertas enviadas" color="green"
          href="/mis-publicaciones"
        />
        <StatCard
          icon="💎" label="Membresía" value="Ver planes"
          sub="Actualizar suscripción" color="blue"
          href="/membresias"
        />
        <StatCard
          icon="👤" label="Mi perfil" value="Editar"
          sub="Información personal" color="purple"
          href="/perfil"
        />
      </div>

      <h2 className="text-white font-semibold text-lg pt-2">Explorar plataforma</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionCard
          icon="🔍"
          title="Buscar consultores"
          description="Encuentra profesionales ambientales para tus proyectos y evaluaciones."
          href="/consultores"
          cta="Ver consultores"
        />
        <ActionCard
          icon="📣"
          title="Publicar oferta laboral"
          description="Conecta con consultores publicando una convocatoria para tu institución."
          href="/consultores"
          cta="Ir a Consultores"
        />
        <ActionCard
          icon="🛒"
          title="Marketplace ecológico"
          description="Compra y vende productos sustentables en la comunidad."
          href="/marketplace"
          cta="Ir al Marketplace"
        />
        <ActionCard
          icon="📚"
          title="Educación ambiental"
          description="Recursos técnicos y materiales de la comunidad para aprender y compartir."
          href="/educacion"
          cta="Ver recursos"
        />
      </div>

      <div className="mt-4 p-5 bg-green-900/20 border border-green-800/30 rounded-xl">
        <h3 className="text-green-300 font-semibold mb-1">¿Eres consultor ambiental?</h3>
        <p className="text-gray-400 text-sm mb-3">
          Cambia tu perfil a Consultor para aparecer en la red y recibir oportunidades laborales.
        </p>
        <Link href="/perfil" className="text-sm text-green-400 hover:text-green-300 font-medium">
          Cambiar tipo de perfil →
        </Link>
      </div>
    </div>
  )
}

function StatCard({
  icon, label, value, sub, color, href
}: {
  icon: string; label: string; value: string; sub: string
  color: 'green' | 'blue' | 'purple'; href?: string
}) {
  const colors = {
    green: 'bg-green-900/20 border-green-800/30 hover:border-green-700/50',
    blue: 'bg-blue-900/20 border-blue-800/30 hover:border-blue-700/50',
    purple: 'bg-purple-900/20 border-purple-800/30 hover:border-purple-700/50',
  }
  const card = (
    <div className={`p-4 rounded-xl border transition ${colors[color]} flex items-center gap-4`}>
      <span className="text-3xl">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
        <div className="text-white font-semibold truncate">{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
      </div>
    </div>
  )
  return href ? <Link href={href}>{card}</Link> : card
}

function ActionCard({
  icon, title, description, href, cta
}: {
  icon: string; title: string; description: string; href: string; cta: string
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 flex flex-col gap-3 transition group">
      <span className="text-3xl">{icon}</span>
      <div className="flex-1">
        <h3 className="text-white font-semibold group-hover:text-green-300 transition">{title}</h3>
        <p className="text-gray-400 text-sm mt-1 leading-relaxed">{description}</p>
      </div>
      <Link href={href} className="text-sm text-green-400 hover:text-green-300 font-medium">
        {cta} →
      </Link>
    </div>
  )
}
