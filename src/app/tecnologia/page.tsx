import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  FiDatabase, FiZap, FiBarChart2, FiCpu, FiGlobe, FiMap,
  FiArrowRight, FiCheckCircle,
} from 'react-icons/fi'
import { FaLeaf } from 'react-icons/fa'

export const metadata: Metadata = {
  title: 'Tecnología para la Sostenibilidad | Biodiversidad.cl',
  description:
    'Soluciones GreenTech: APIs ambientales, automatización para consultores, dashboards de control ambiental e IA aplicada al medio ambiente.',
}

const services = [
  {
    Icon: FiDatabase,
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'group-hover:shadow-emerald-900/40',
    badge: 'Datos Abiertos',
    title: 'Integraciones con APIs Ambientales',
    description:
      'Conexión con fuentes de datos públicas y privadas para tener información ambiental actualizada en tiempo real.',
    features: [
      'Ministerio del Medio Ambiente',
      'SINIA · SEA · SMA',
      'CONAF · SAG',
      'Datos climáticos abiertos',
    ],
  },
  {
    Icon: FiZap,
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'group-hover:shadow-blue-900/40',
    badge: 'Automatización',
    title: 'Automatización para Consultores',
    description:
      'Flujos inteligentes que reducen el trabajo manual y aceleran los procesos de consultoría ambiental.',
    features: [
      'Generación automática de informes',
      'Seguimiento de proyectos',
      'Flujos documentales',
      'Formularios inteligentes + IA',
    ],
  },
  {
    Icon: FiBarChart2,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'group-hover:shadow-violet-900/40',
    badge: 'Gestión Ambiental',
    title: 'Dashboard ESG y Control Ambiental',
    description:
      'Ordena tus indicadores ambientales, documentos, compromisos y evidencias en un panel simple para tomar mejores decisiones, preparar reportes y responder con claridad ante clientes, licitaciones, auditorías o fiscalizaciones.',
    features: [
      'Huella de carbono y residuos',
      'Documentos y compromisos',
      'Listo para auditorías y licitaciones',
      'Pymes · Consultores · Municipios',
    ],
  },
  {
    Icon: FiCpu,
    gradient: 'from-sky-500 to-blue-600',
    glow: 'group-hover:shadow-sky-900/40',
    badge: 'Inteligencia Artificial',
    title: 'IA Aplicada al Medio Ambiente',
    description:
      'Modelos de IA entrenados para el dominio ambiental y normativo chileno, listos para integrarse en tus procesos.',
    features: [
      'Asistentes inteligentes',
      'Interpretación normativa',
      'Análisis documental',
      'Búsqueda semántica',
    ],
  },
  {
    Icon: FiGlobe,
    gradient: 'from-teal-500 to-emerald-600',
    glow: 'group-hover:shadow-teal-900/40',
    badge: 'Desarrollo Digital',
    title: 'Desarrollo Web y Plataformas',
    description:
      'Soluciones digitales a medida para empresas, consultoras e instituciones del sector ambiental chileno.',
    features: [
      'Sitios y portales institucionales',
      'Plataformas educativas',
      'Marketplaces verdes',
      'Aplicaciones personalizadas',
    ],
  },
  {
    Icon: FiMap,
    gradient: 'from-green-500 to-teal-500',
    glow: 'group-hover:shadow-green-900/40',
    badge: 'GIS Territorial',
    title: 'Mapas, GIS y Monitoreo Territorial',
    description:
      'Visualización geoespacial de datos ambientales, proyectos y biodiversidad a nivel regional y nacional.',
    features: [
      'Mapas interactivos por región',
      'Datos de biodiversidad',
      'Monitoreo de campañas',
      'Integración GIS',
    ],
  },
]

const integrations = [
  'Ministerio del Medio Ambiente', 'SINIA', 'SEA', 'SMA',
  'CONAF', 'SAG', 'Datos Meteorológicos', 'Sistemas GIS',
  'APIs Externas', 'Inteligencia Artificial',
]

export default function TecnologiaPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <TechHero />
      <AlephBanner />
      <DiagnosticoDestacado />
      <ServicesSection />
      <IntegrationsSection />
      <TechCTA />
    </div>
  )
}

function TechHero() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 pt-20 pb-16 md:pt-28 md:pb-24">
      {/* Background image */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/assets/hero/hero-tecnologia.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        {/* Gradient fade al fondo */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-neutral-950/50 to-neutral-950" />
      </div>

      {/* Ambient blobs + grid sobre la imagen */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-green-600/8 blur-[120px]" />
        <div className="absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-teal-600/6 blur-[80px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/8 px-4 py-1.5 text-sm font-medium text-green-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
          GreenTech · IA · ESG
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          Tecnología para la{' '}
          <span className="bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
            Sostenibilidad
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
          Impulsamos soluciones tecnológicas para empresas, consultores ambientales e instituciones
          que buscan integrar automatización, inteligencia artificial y datos en sus procesos de
          sostenibilidad.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-green-500 hover:to-teal-500 hover:shadow-green-800/40"
          >
            Solicitar asesoría
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
          </Link>
          <a
            href="#servicios"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-6 py-3 font-medium text-white transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-700"
          >
            Ver servicios
          </a>
        </div>

        {/* Stat pills */}
        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { value: '6+', label: 'Servicios Tech' },
            { value: '10+', label: 'APIs Ambientales' },
            { value: 'ESG', label: 'Gestión ambiental' },
            { value: 'IA', label: 'Aplicada al sector' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur"
            >
              <div className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-2xl font-bold text-transparent">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AlephBanner() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-8">
      <div className="relative overflow-hidden rounded-2xl border border-blue-800/30 bg-gradient-to-r from-blue-950/50 via-neutral-900/60 to-neutral-900/60 p-6 backdrop-blur md:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-600/8 blur-3xl" />
        <div className="relative flex flex-col items-center gap-8 md:flex-row">
          {/* Logo real de Aleph Server sobre fondo blanco */}
          <div className="shrink-0 rounded-2xl bg-white px-5 py-3 shadow-lg shadow-blue-950/30">
            <Image
              src="/assets/partnerships/aleph-server-logo.svg"
              alt="Aleph Server"
              width={160}
              height={52}
              className="h-10 w-auto"
            />
          </div>
          <div className="text-center md:text-left">
            <span className="mb-2 inline-block rounded-md bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-blue-400">
              Alianza Estratégica
            </span>
            <h2 className="mb-1 text-lg font-semibold text-white">
              Biodiversidad.cl × Aleph Server
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-400">
              Esta línea tecnológica se desarrolla en alianza con{' '}
              <span className="font-medium text-blue-400">Aleph Server</span>, fortaleciendo la
              capacidad de Biodiversidad.cl para crear soluciones digitales de alto impacto
              aplicadas a la sostenibilidad ambiental chilena.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function DiagnosticoDestacado() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-4">
      <Link
        href="/landing"
        className="group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden rounded-2xl border border-green-700/30 bg-gradient-to-r from-green-950/60 via-teal-950/30 to-neutral-900/50 p-6 md:p-8 transition-all duration-300 hover:border-green-600/50"
      >
        {/* Glow */}
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-green-500/8 blur-3xl" />

        <div className="relative flex items-start gap-5">
          <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/20 border border-green-600/30 text-3xl">
            🌿
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-green-400">
                Servicio estrella
              </span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors duration-200">
              Diagnóstico Ambiental Express
            </h3>
            <p className="mt-1 text-sm text-gray-400 max-w-xl">
              Evalúa el estado ambiental de tu organización, identifica brechas y recibe un plan
              de acción concreto. Resultados en 48 horas.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
              {[
                'Identifica brechas normativas',
                'Plan de acción accionable',
                'Resultados en 48h',
                'Apto para cualquier sector',
              ].map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <FiCheckCircle size={11} className="text-green-500" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative shrink-0">
          <span className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-900/30 transition-all duration-300 group-hover:bg-green-500 group-hover:shadow-green-800/40">
            Ver diagnóstico
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
          </span>
        </div>
      </Link>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="servicios" className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          Servicios{' '}
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Tecnológicos
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-gray-400">
          Soluciones especializadas para el ecosistema ambiental chileno, desde integraciones de
          datos hasta inteligencia artificial aplicada.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => {
          const { Icon } = svc
          return (
            <div
              key={svc.title}
              className={`group relative rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:shadow-xl ${svc.glow}`}
            >
              {/* Icon */}
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${svc.gradient} shadow-md transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="text-white" size={22} />
              </div>

              {/* Badge */}
              <span className="mb-3 inline-block rounded-md bg-neutral-800 px-2 py-0.5 text-xs font-medium text-gray-400">
                {svc.badge}
              </span>

              <h3 className="mb-2 text-base font-semibold text-white transition-colors duration-300 group-hover:text-green-300">
                {svc.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-500">{svc.description}</p>

              <ul className="space-y-1.5">
                {svc.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function IntegrationsSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 md:p-10">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
            Preparado para futuras{' '}
            <span className="text-green-400">integraciones</span>
          </h2>
          <p className="mx-auto max-w-xl text-sm text-gray-400">
            La arquitectura está diseñada para conectarse con los principales organismos y fuentes
            de datos ambientales de Chile y el mundo.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {integrations.map((item) => (
            <span
              key={item}
              className="rounded-full border border-neutral-700 bg-neutral-800 px-4 py-1.5 text-sm text-gray-300 transition-colors duration-200 hover:border-green-700/60 hover:text-green-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function TechCTA() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-2xl border border-green-800/25 bg-gradient-to-br from-green-950/50 via-teal-950/30 to-blue-950/50 p-10 text-center md:p-14">
        {/* Blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-600/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/8 px-3 py-1 text-xs font-medium text-green-400">
            <FaLeaf size={10} />
            GreenTech por Biodiversidad.cl × Aleph Server
          </div>

          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            ¿Tienes un proyecto ambiental que{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              necesita tecnología?
            </span>
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-400">
            Conversemos sobre cómo integrar automatización, datos e inteligencia artificial en tu
            organización o institución.
          </p>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-green-900/25 transition-all duration-300 hover:-translate-y-1 hover:from-green-500 hover:to-blue-500 hover:shadow-green-800/40"
          >
            Solicitar asesoría tecnológica
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={18} />
          </Link>

          {/* Trust signals */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            {[
              { icon: FiCheckCircle, text: 'Sin compromiso' },
              { icon: FiCheckCircle, text: 'Primera consulta gratuita' },
              { icon: FiCheckCircle, text: 'Equipo especializado' },
            ].map(({ icon: IconComp, text }) => (
              <span key={text} className="flex items-center gap-1.5">
                <IconComp size={14} className="text-green-600" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
