'use client'
import { useState, useEffect } from 'react'
import { FiAlertTriangle, FiInfo, FiExternalLink } from 'react-icons/fi'

interface Quake {
  id: string
  magnitude: number
  place: string
  time: number
  depth: number
  url: string
}

interface QuakeData {
  chile: Quake[]
  world: Quake[]
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms
  const m = Math.floor(diff / 60000)
  if (m < 60) return `hace ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `hace ${h}h`
  return `hace ${Math.floor(h / 24)}d`
}

function MagBadge({ mag }: { mag: number }) {
  const cls =
    mag >= 7 ? 'bg-red-600 text-white shadow-red-500/50 shadow-md' :
    mag >= 6 ? 'bg-red-500 text-white' :
    mag >= 5 ? 'bg-orange-500 text-white' :
    mag >= 4 ? 'bg-yellow-400 text-black' :
    mag >= 3 ? 'bg-green-600 text-white' :
               'bg-gray-600 text-white'
  return (
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs leading-tight ${cls} ${mag >= 7 ? 'animate-pulse' : ''}`}>
      <span className="text-[10px] font-normal opacity-80">M</span>
      <span className="text-sm leading-none">{mag.toFixed(1)}</span>
    </div>
  )
}

function QuakeRow({ quake }: { quake: Quake }) {
  return (
    <a
      href={quake.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
    >
      <MagBadge mag={quake.magnitude} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200 truncate">{quake.place}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {timeAgo(quake.time)} · Prof. {quake.depth} km
        </p>
      </div>
      <FiExternalLink size={12} className="text-gray-700 group-hover:text-gray-400 transition-colors flex-shrink-0" />
    </a>
  )
}

function CardSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3 p-2.5">
          <div className="w-12 h-12 rounded-xl bg-white/10 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded bg-white/10 animate-pulse w-3/4" />
            <div className="h-3 rounded bg-white/10 animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SeismicSection() {
  const [data, setData] = useState<QuakeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/earthquakes')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const maxChileMag = data?.chile[0]?.magnitude ?? 0

  return (
    <section className="relative py-20 bg-neutral-900 overflow-hidden">
      <div className="absolute top-0 left-1/3 h-64 w-96 rounded-full bg-red-700/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 h-64 w-96 rounded-full bg-orange-700/6 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur px-4 py-1.5 text-sm font-medium text-red-300 mb-5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            Actualizado cada 5 minutos · USGS
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Actividad{' '}
            <span className="bg-gradient-to-r from-red-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              Sísmica
            </span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Chile es uno de los países más sísmicos del planeta. Datos en tiempo real del
            Servicio Geológico de EE.UU. (USGS).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Chile — main column */}
          <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇨🇱</span>
                <span className="font-semibold text-white">Sismicidad en Chile</span>
                <span className="text-xs text-gray-500">(últimas 24h)</span>
              </div>
              {!loading && maxChileMag >= 5 && (
                <div className="flex items-center gap-1 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-full">
                  <FiAlertTriangle size={11} />
                  M{maxChileMag}+ detectado
                </div>
              )}
            </div>

            {loading ? <CardSkeleton /> : data?.chile.length ? (
              <div className="divide-y divide-white/5">
                {data.chile.map(q => <QuakeRow key={q.id} quake={q} />)}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4">Sin actividad registrada en las últimas 24h.</p>
            )}
          </div>

          {/* World significant */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🌍</span>
              <span className="font-semibold text-white">Mundo</span>
              <span className="text-xs text-gray-500">(esta semana)</span>
            </div>
            <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-600">
              <FiInfo size={11} />
              Solo eventos significativos (M5.5+)
            </div>

            {loading ? <CardSkeleton /> : data?.world.length ? (
              <div className="divide-y divide-white/5">
                {data.world.map(q => <QuakeRow key={q.id} quake={q} />)}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4">Sin eventos significativos esta semana.</p>
            )}

            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-600 inline-block" /> &lt;3</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-600 inline-block" /> 3–4</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400 inline-block" /> 4–5</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500 inline-block" /> 5–6</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500 inline-block" /> 6+</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-700">
          Fuente: U.S. Geological Survey (USGS) Earthquake Hazards Program
        </p>
      </div>
    </section>
  )
}
