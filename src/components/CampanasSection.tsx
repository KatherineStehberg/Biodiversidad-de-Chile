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
  featured?: boolean
  verified?: boolean
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Reforestación en Patagonia',
    org: 'Fundación Bosques Vivos',
    description: 'Restauración de bosques nativos del sur de Chile. Queremos plantar 5.000 árboles para devolver vida a ecosistemas degradados por incendios.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80',
    category: 'Reforestación',
    raised: 3600000,
    goal: 5000000,
    donors: 234,
    daysLeft: 21,
    featured: true,
    verified: true,
  },
  {
    id: '2',
    title: 'Protección de Humedales Urbanos',
    org: 'ONG Humedales Chile',
    description: 'Conservación y educación ambiental para proteger los últimos humedales urbanos de Santiago y otras ciudades.',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=700&q=80',
    category: 'Conservación',
    raised: 1350000,
    goal: 3000000,
    donors: 89,
    daysLeft: 45,
    verified: true,
  },
  {
    id: '3',
    title: 'Campaña Nacional de Reciclaje',
    org: 'ReciclaChile',
    description: 'Distribuir 1.000 kits educativos en escuelas municipales para promover el reciclaje desde la infancia.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=700&q=80',
    category: 'Reciclaje',
    raised: 2440000,
    goal: 4000000,
    donors: 178,
    daysLeft: 12,
  },
  {
    id: '4',
    title: 'Salvemos a los Polinizadores',
    org: 'Apicultores del Sur',
    description: 'Creación de 200 jardines urbanos con plantas nativas para apoyar a abejas y mariposas en ciudades chilenas.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80',
    category: 'Biodiversidad',
    raised: 860000,
    goal: 2600000,
    donors: 67,
    daysLeft: 58,
  },
  {
    id: '5',
    title: 'Educación Ambiental Rural',
    org: 'Red Educadores Verdes',
    description: 'Talleres itinerantes de educación ambiental para comunidades rurales en regiones con alta presión sobre ecosistemas.',
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=700&q=80',
    category: 'Educación',
    raised: 550000,
    goal: 1500000,
    donors: 43,
    daysLeft: 30,
  },
  {
    id: '6',
    title: 'Limpieza de Playas Patagónicas',
    org: 'Mar Limpio',
    description: 'Operativos de limpieza y monitoreo de residuos en playas y costas de la Región de Aysén y Los Lagos.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
    category: 'Conservación',
    raised: 410000,
    goal: 1200000,
    donors: 31,
    daysLeft: 40,
  },
]

const CATEGORIES = ['Todas', 'Reforestación', 'Conservación', 'Reciclaje', 'Biodiversidad', 'Educación']

const IMPACT_STATS = [
  { value: '12', label: 'Campañas activas' },
  { value: '642', label: 'Personas apoyando' },
  { value: '5', label: 'Proyectos completados' },
  { value: '3.600', label: 'Árboles plantados' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCLP(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

function pct(raised: number, goal: number) {
  return Math.min(Math.round((raised / goal) * 100), 100)
}

// ─── Proximamente Button ──────────────────────────────────────────────────────

function ProximamenteBtn({ label, className }: { label: string; className: string }) {
  const [msg, setMsg] = useState(false)
  return (
    <div className="w-full text-center">
      <button
        className={className}
        onClick={() => { setMsg(true); setTimeout(() => setMsg(false), 3000) }}
      >
        {label}
      </button>
      {msg && <p className="text-xs mt-1.5 text-yellow-400 font-medium">Próximamente disponible</p>}
    </div>
  )
}

// ─── Campaign Card ────────────────────────────────────────────────────────────

function CampaignCard({ c }: { c: Campaign }) {
  const p = pct(c.raised, c.goal)
  const urgent = c.daysLeft <= 14
  return (
    <div className="group flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all duration-300 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      {/* Image */}
      <div className="relative h-44 overflow-hidden shrink-0">
        <Image src={c.image} alt={c.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/80 px-2.5 py-0.5 text-xs font-medium text-gray-300">
          {c.category}
        </span>
        {urgent && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-orange-500/20 border border-orange-500/40 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
            <FiClock size={10} />
            {c.daysLeft}d
          </span>
        )}
        {c.verified && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-green-900/60 border border-green-700/50 px-2 py-0.5 text-xs text-green-400">
            <FiCheckCircle size={10} /> Verificada
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs text-gray-600 mb-1">{c.org}</p>
        <h4 className="text-sm font-semibold text-white group-hover:text-green-300 transition-colors duration-200 mb-2 leading-snug">
          {c.title}
        </h4>
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">{c.description}</p>

        {/* Progress */}
        <div className="mb-3">
          <div className="w-full bg-neutral-800 rounded-full h-1.5 mb-2">
            <div
              className="bg-gradient-to-r from-green-600 to-emerald-500 h-1.5 rounded-full"
              style={{ width: `${p}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">{fmtCLP(c.raised)}</span>
            <span className="font-bold text-green-400">{p}%</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 mt-0.5">
            <span className="flex items-center gap-1"><FiUsers size={10} /> {c.donors} donantes</span>
            <span>{!urgent ? `${c.daysLeft} días` : <span className="text-orange-400">{c.daysLeft} días</span>}</span>
          </div>
        </div>

        <ProximamenteBtn
          label="Apoyar"
          className="w-full rounded-xl bg-green-600/15 border border-green-800/30 py-2 text-sm font-semibold text-green-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200"
        />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CampanasSection() {
  const [activeCategory, setActiveCategory] = useState('Todas')
  const featured = CAMPAIGNS.find(c => c.featured)!
  const rest = CAMPAIGNS.filter(c => !c.featured)
  const filtered = activeCategory === 'Todas' ? rest : rest.filter(c => c.category === activeCategory)

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[480px] flex items-center justify-center overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 bg-[url('/assets/hero/hero-campanas.png')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-neutral-950/20 to-neutral-950" />
        <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-green-600/10 blur-[90px]" />
        <div className="absolute bottom-10 right-1/4 h-48 w-48 rounded-full bg-emerald-500/8 blur-[70px]" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-800/40 bg-green-900/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-400 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Comunidad Verde
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Súmate a las{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Campañas Verdes
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Apoya proyectos ambientales verificados y sé parte del cambio. Cada aporte cuenta.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#campanas"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 font-semibold text-white hover:bg-green-500 transition-colors duration-200"
            >
              Ver campañas
              <FiArrowRight size={16} />
            </a>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 backdrop-blur-sm px-7 py-3 font-semibold text-gray-300 hover:border-green-700 hover:text-green-300 transition-all duration-200"
            >
              Crear campaña
            </Link>
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section className="bg-neutral-950 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {IMPACT_STATS.map(s => (
              <div key={s.label} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 text-center">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAMPAÑA DESTACADA ── */}
      <section className="bg-neutral-950 pb-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-green-400">Campaña destacada</span>
          </div>

          <div className="group relative rounded-2xl border border-green-800/30 bg-neutral-900 overflow-hidden hover:border-green-700/50 transition-all duration-300">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-900/20 md:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent md:hidden" />
                {featured.verified && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-green-900/80 border border-green-700/60 px-3 py-1 text-xs font-semibold text-green-400">
                    <FiCheckCircle size={11} /> Verificada
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{featured.org}</p>
                  <h2 className="text-2xl font-bold text-white mb-3">{featured.title}</h2>
                  <p className="text-gray-400 leading-relaxed text-sm mb-6">{featured.description}</p>

                  {/* Progress block */}
                  <div className="bg-neutral-800/60 rounded-xl p-4 mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-extrabold text-white">{fmtCLP(featured.raised)}</span>
                      <span className="text-sm font-bold text-green-400">{pct(featured.raised, featured.goal)}%</span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-green-600 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${pct(featured.raised, featured.goal)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Meta: {fmtCLP(featured.goal)}</span>
                      <span className="flex items-center gap-1"><FiUsers size={10} /> {featured.donors} donantes</span>
                      <span className="flex items-center gap-1"><FiClock size={10} /> {featured.daysLeft} días</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <ProximamenteBtn
                    label="Donar ahora"
                    className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-500 transition-colors duration-200"
                  />
                  <button className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-gray-400 hover:text-white hover:border-neutral-600 transition-all duration-200">
                    <FiShare2 size={15} />
                    <span className="hidden sm:inline">Compartir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTROS + GRID ── */}
      <section id="campanas" className="bg-neutral-950 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header + filtros */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-white">Más campañas activas</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-green-600 text-white'
                      : 'border border-neutral-700 bg-neutral-800/60 text-gray-400 hover:border-green-700 hover:text-green-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(c => <CampaignCard key={c.id} c={c} />)}
            </div>
          ) : (
            <div className="py-16 text-center rounded-2xl border border-neutral-800 bg-neutral-900">
              <p className="text-gray-500">No hay campañas en esta categoría aún.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA CREAR CAMPAÑA ── */}
      <section className="bg-neutral-950 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden border border-green-800/30 bg-gradient-to-br from-green-950/60 to-neutral-900 p-8 md:p-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-96 rounded-full bg-green-600/10 blur-[70px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Left */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-green-600/20 border border-green-600/30 mb-4">
                  <FiHeart className="text-green-400" size={22} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¿Tienes una causa verde?</h3>
                <p className="text-gray-400 max-w-md">
                  Si eres una ONG, municipio o emprendimiento verificado, puedes crear tu propia campaña y conectar con cientos de personas que quieren apoyar el medio ambiente.
                </p>
              </div>
              {/* Right: steps + CTA */}
              <div className="flex-1 w-full">
                <ul className="space-y-2 mb-6">
                  {[
                    'Crea tu cuenta o ingresa',
                    'Completa los datos de tu campaña',
                    'El equipo la revisa y publica',
                    'Comienza a recibir apoyo',
                  ].map((step, i) => (
                    <li key={step} className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-green-900/40 border border-green-800/40 text-xs font-bold text-green-400">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-500 transition-colors duration-200 w-full justify-center md:w-auto"
                >
                  Crear campaña
                  <FiArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
