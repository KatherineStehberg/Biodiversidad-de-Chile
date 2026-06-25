'use client'
import { useState, useEffect } from 'react'
import { FiInfo, FiCalendar } from 'react-icons/fi'

interface Species {
  id: number
  name: string
  commonName: string | null
  kingdom: string | null
  class: string | null
  region: string
  date: string | null
  image: string | null
}

interface NaturalEvent {
  id: string
  title: string
  category: string
  categoryId: string
  icon: string
  date: string | null
}

interface BioData {
  species: Species[]
  events: NaturalEvent[]
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function SpeciesCard({ sp }: { sp: Species }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-green-500/30 transition-all duration-300">
      <div className="relative h-32 bg-neutral-800 overflow-hidden">
        {sp.image && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sp.image}
            alt={sp.commonName ?? sp.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {sp.kingdom === 'Animalia' ? '🦎' : sp.kingdom === 'Plantae' ? '🌿' : '🔬'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {sp.class && (
          <span className="absolute top-2 left-2 text-[10px] text-white/70 bg-black/40 backdrop-blur px-2 py-0.5 rounded-full">
            {sp.class}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-green-300 truncate leading-tight">
          {sp.commonName ?? sp.name}
        </p>
        {sp.commonName && (
          <p className="text-[10px] text-gray-600 italic truncate mt-0.5">{sp.name}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-gray-500 truncate">{sp.region}</span>
          {sp.date && (
            <span className="text-[10px] text-gray-600 flex-shrink-0">{formatDate(sp.date)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function SpeciesSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="h-32 bg-white/10 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 rounded bg-white/10 animate-pulse w-3/4" />
        <div className="h-3 rounded bg-white/10 animate-pulse w-1/2" />
      </div>
    </div>
  )
}

export default function BiodiversityLiveSection() {
  const [data, setData] = useState<BioData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/biodiversity')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="relative py-20 bg-neutral-950 overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 h-96 w-64 rounded-full bg-emerald-700/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 h-96 w-64 rounded-full bg-teal-700/8 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur px-4 py-1.5 text-sm font-medium text-emerald-300 mb-5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Observaciones en vivo · Satélite NASA
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Biodiversidad y{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Satélite
            </span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Avistamientos reales de especies en Chile registrados por la comunidad científica,
            y eventos naturales activos detectados por satélites NASA.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Species grid — 2/3 width */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🦋</span>
                <span className="font-semibold text-white">Avistamientos en Chile</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <FiInfo size={11} /> GBIF · iNaturalist
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SpeciesSkeleton key={i} />)
                : data?.species.length
                  ? data.species.map(sp => <SpeciesCard key={sp.id} sp={sp} />)
                  : <p className="text-sm text-gray-500 col-span-3">Sin datos disponibles.</p>
              }
            </div>

            <p className="mt-4 text-xs text-gray-700">
              Fuente: Global Biodiversity Information Facility (GBIF) · Observaciones humanas verificadas
            </p>
          </div>

          {/* NASA EONET events — 1/3 width */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛰️</span>
                <span className="font-semibold text-white">Eventos Activos</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <FiInfo size={11} /> NASA EONET
              </span>
            </div>

            <div className="space-y-3">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 rounded bg-white/10 animate-pulse w-full" />
                        <div className="h-3 rounded bg-white/10 animate-pulse w-2/3" />
                      </div>
                    </div>
                  ))
                : data?.events.length
                  ? data.events.map(ev => (
                      <div
                        key={ev.id}
                        className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                          {ev.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-200 leading-snug">{ev.title}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                              {ev.category}
                            </span>
                            {ev.date && (
                              <span className="text-[10px] text-gray-600 flex items-center gap-0.5">
                                <FiCalendar size={9} />
                                {formatDate(ev.date)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  : <p className="text-sm text-gray-500">Sin eventos activos.</p>
              }
            </div>

            <p className="mt-4 text-xs text-gray-700">
              Fuente: NASA Earth Observatory Natural Event Tracker (EONET)
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
