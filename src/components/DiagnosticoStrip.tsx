import Link from 'next/link'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'

export default function DiagnosticoStrip() {
  return (
    <section className="bg-neutral-950 px-4 pb-4">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/landing"
          className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-green-800/30 bg-gradient-to-r from-green-950/60 to-neutral-900/60 px-6 py-5 transition-all duration-300 hover:border-green-700/50 hover:from-green-950/80"
        >
          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-green-600/20 border border-green-600/30 text-green-400 text-xl">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-green-500/80">Servicio destacado</span>
              </div>
              <p className="text-base font-semibold text-white group-hover:text-green-300 transition-colors duration-200">
                Diagnóstico Ambiental Express
              </p>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                {['Identifica brechas', 'Plan de acción', 'Resultados en 48h'].map(f => (
                  <span key={f} className="flex items-center gap-1 text-xs text-gray-500">
                    <FiCheckCircle size={11} className="text-green-600" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <span className="shrink-0 flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 group-hover:bg-green-500">
            Ver diagnóstico
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={14} />
          </span>
        </Link>
      </div>
    </section>
  )
}
