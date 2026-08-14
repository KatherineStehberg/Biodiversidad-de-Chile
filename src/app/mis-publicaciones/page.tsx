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
        <p className="text-neutral-400">Cargando publicaciones...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mis publicaciones</h1>
            <p className="text-neutral-400 mt-2">Administra tus ofertas publicadas.</p>
          </div>
          <Link href="/ofertas/nueva" className="rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2 font-medium">
            Nueva publicación
          </Link>
        </div>

        {offers.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 text-center text-neutral-400">
            Aún no tienes publicaciones.
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <article key={offer.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{offer.title}</h2>
                    <p className="text-sm text-neutral-400">{offer.modality}</p>
                  </div>
                  <span className={`text-sm font-medium ${offer.isApproved ? 'text-green-400' : 'text-amber-400'}`}>
                    {offer.isApproved ? 'Publicada' : 'Pendiente de aprobación'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
