'use client'

const TIPOS = ['Cursos', 'Webinars', 'Guías', 'Eventos']

export default function HeroEducacion() {
  return (
    <section className="relative min-h-[420px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/hero/hero-educacion.jpg')] bg-cover bg-center opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950" />
      <div className="absolute top-16 right-1/3 h-64 w-64 rounded-full bg-emerald-600/10 blur-[90px]" />
      <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-teal-500/8 blur-[70px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-green-800/40 bg-green-900/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-400 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          Educación Ambiental
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
          Aprende y enseña{' '}
          <span className="bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent">
            sostenibilidad
          </span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Descarga recursos, participa en eventos y comparte conocimientos ambientales
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-500 transition-colors duration-200">
            Todo
          </button>
          {TIPOS.map(tipo => (
            <button
              key={tipo}
              className="rounded-full border border-neutral-700 bg-neutral-900/80 backdrop-blur-sm px-5 py-2 text-sm font-medium text-gray-300 hover:border-green-700 hover:text-green-300 transition-all duration-200"
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
