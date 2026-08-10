'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Offer {
  id: string
  title: string
  modality: string
  isApproved: boolean
  created_at: string
}

export default function MisPublicacionesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [offers, setOffers] = useState<Offer[]>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data } = await supabase
        .from('offers')
        .select('id,title,modality,isApproved,created_at')
        .eq('userId', user.id)
        .order('created_at', { ascending: false })

      setOffers(data || [])
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Mis publicaciones</h1>
          <Link href="/perfil" className="text-sm text-gray-400 hover:text-white transition">
            ← Volver al perfil
          </Link>
        </div>

        {offers.length === 0 ? (
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-white font-semibold mb-2">Sin publicaciones aún</h2>
            <p className="text-gray-400 text-sm mb-6">Publica una oferta laboral o convocatoria en la sección de Consultores.</p>
            <Link
              href="/consultores"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Ir a Consultores
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map(offer => (
              <div key={offer.id} className="bg-neutral-900 rounded-xl border border-neutral-800 p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{offer.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{offer.modality} · {new Date(offer.created_at).toLocaleDateString('es-CL')}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${offer.isApproved ? 'bg-green-900/40 text-green-300' : 'bg-yellow-900/40 text-yellow-300'}`}>
                  {offer.isApproved ? 'Aprobada' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
