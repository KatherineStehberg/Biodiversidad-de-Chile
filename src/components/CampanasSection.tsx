'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiHeart, FiUsers, FiClock, FiShare2, FiCheckCircle } from 'react-icons/fi'

// ─── Types ───────────────────────────────────────────────────────────────────

type Campaign = {
  id: string
  title: string
  org: string
  description: string
  image: string
  category: string
  raised: number
  goal: number
  donors: number
  daysLeft: number
}

const campaigns: Campaign[] = [
  {
    id: 'bosque-nativo',
    title: 'Protejamos el bosque nativo',
    org: 'Fundación Bosque Vivo',
    description: 'Apoya la conservación y restauración de ecosistemas de bosque nativo en Chile.',
    image: '/images/content/bosque-nativo.jpg',
    category: 'Conservación',
    raised: 680000,
    goal: 1000000,
    donors: 84,
    daysLeft: 18,
  },
  {
    id: 'humedales',
    title: 'Humedales para el futuro',
    org: 'Red de Humedales',
    description: 'Fortalecemos educación, monitoreo y acciones comunitarias para proteger humedales urbanos.',
    image: '/images/content/humedales.jpg',
    category: 'Restauración',
    raised: 420000,
    goal: 800000,
    donors: 57,
    daysLeft: 25,
  },
]

export default function CampanasSection() {
  const [sharedId, setSharedId] = useState<string | null>(null)

  async function shareCampaign(campaign: Campaign) {
    const url = `${window.location.origin}/campanas/${campaign.id}`
    if (navigator.share) {
      await navigator.share({ title: campaign.title, text: campaign.description, url })
    } else {
      await navigator.clipboard.writeText(url)
      setSharedId(campaign.id)
      window.setTimeout(() => setSharedId(null), 2000)
    }
  }

  return (
    <section className="py-16 px-4 bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-green-400 font-medium mb-2">Campañas</p>
            <h2 className="text-3xl md:text-4xl font-bold">Acciones que necesitan apoyo</h2>
          </div>
          <Link href="/campanas" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium">
            Ver todas <FiArrowRight />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {campaigns.map((campaign) => {
            const progress = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))
            return (
              <article key={campaign.id} className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                <div className="relative h-56">
                  <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-sm text-green-400">{campaign.category}</p>
                  <h3 className="text-xl font-semibold mt-1">{campaign.title}</h3>
                  <p className="text-sm text-neutral-400 mt-1">{campaign.org}</p>
                  <p className="text-neutral-300 mt-4">{campaign.description}</p>

                  <div className="mt-5 h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between text-sm text-neutral-400 mt-2">
                    <span>${campaign.raised.toLocaleString('es-CL')} de ${campaign.goal.toLocaleString('es-CL')}</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-5 text-sm text-neutral-300">
                    <span className="inline-flex items-center gap-1"><FiUsers /> {campaign.donors} aportes</span>
                    <span className="inline-flex items-center gap-1"><FiClock /> {campaign.daysLeft} días</span>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Link href={`/campanas/${campaign.id}`} className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2 font-medium">
                      <FiHeart /> Apoyar
                    </Link>
                    <button type="button" onClick={() => shareCampaign(campaign)} className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 px-4 py-2">
                      {sharedId === campaign.id ? <FiCheckCircle /> : <FiShare2 />}
                      {sharedId === campaign.id ? 'Copiado' : 'Compartir'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
