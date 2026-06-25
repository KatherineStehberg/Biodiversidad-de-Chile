'use client'

import Link from 'next/link'
import { useGamification } from '@/hooks/useGamification'
import { AchievementCategory } from '@/lib/gamification'

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  perfil:    'Perfil',
  actividad: 'Actividad',
  comunidad: 'Comunidad',
}

const LEVEL_BAR_COLORS: Record<string, string> = {
  amber:   'bg-amber-500',
  green:   'bg-green-500',
  emerald: 'bg-emerald-500',
  teal:    'bg-teal-500',
  cyan:    'bg-cyan-500',
}

const LEVEL_TEXT_COLORS: Record<string, string> = {
  amber:   'text-amber-400',
  green:   'text-green-400',
  emerald: 'text-emerald-400',
  teal:    'text-teal-400',
  cyan:    'text-cyan-400',
}

export default function GamificationPanel() {
  const { loading, points, level, nextLevel, progress, achievements, isConsultant } = useGamification()

  if (loading) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 animate-pulse">
        <div className="h-5 bg-neutral-800 rounded w-1/3" />
        <div className="h-3 bg-neutral-800 rounded-full w-full" />
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-10 bg-neutral-800 rounded-xl" />)}
        </div>
      </div>
    )
  }

  const completed = achievements.filter(a => a.completed)
  const pending = achievements.filter(a => !a.completed)
  const barColor = LEVEL_BAR_COLORS[level.tw] ?? 'bg-green-500'
  const textColor = LEVEL_TEXT_COLORS[level.tw] ?? 'text-green-400'

  // Group pending by category
  const pendingByCategory = pending.reduce<Record<string, typeof pending>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = []
    acc[a.category].push(a)
    return acc
  }, {})

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

      {/* ── Header nivel + puntos ── */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Tu nivel</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{level.emoji}</span>
              <div>
                <h3 className={`text-xl font-bold ${textColor}`}>{level.name}</h3>
                <p className="text-xs text-gray-500">
                  {isConsultant ? 'Consultor ambiental' : 'Usuario de la plataforma'}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-extrabold ${textColor}`}>{points}</p>
            <p className="text-xs text-gray-500">puntos</p>
          </div>
        </div>

        {/* Barra de progreso */}
        {nextLevel ? (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>{progress.current} / {progress.needed} pts en este nivel</span>
              <span>Siguiente: {nextLevel.emoji} {nextLevel.name}</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${progress.pct}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-center text-cyan-400 mt-2">🏆 ¡Has alcanzado el nivel máximo!</p>
        )}
      </div>

      {/* ── Logros completados ── */}
      {completed.length > 0 && (
        <div className="px-6 pb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Logros obtenidos ({completed.length})
          </p>
          <div className="space-y-2">
            {completed.map(a => (
              <div
                key={a.id}
                className="flex items-center justify-between bg-green-900/10 border border-green-800/20 rounded-xl px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{a.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{a.label}</p>
                    <p className="text-xs text-gray-500">{CATEGORY_LABELS[a.category]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-green-400">+{a.points}</span>
                  <span className="text-green-400 text-sm">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Logros pendientes ── */}
      {pending.length > 0 && (
        <div className="px-6 pt-4 pb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Por conseguir
          </p>
          <div className="space-y-4">
            {Object.entries(pendingByCategory).map(([cat, items]) => (
              <div key={cat}>
                <p className="text-xs text-gray-600 mb-2">{CATEGORY_LABELS[cat as AchievementCategory]}</p>
                <div className="space-y-2">
                  {items.map(a => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between bg-neutral-800/50 rounded-xl px-4 py-2.5 opacity-60 hover:opacity-80 transition-opacity"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg grayscale">{a.emoji}</span>
                        <div>
                          <p className="text-sm text-gray-400">{a.label}</p>
                          <p className="text-xs text-gray-600">{a.description}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 shrink-0">+{a.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA si no tiene membresía */}
          {!achievements.find(a => a.id === 'membership')?.completed && (
            <div className="mt-5 bg-amber-950/30 border border-amber-800/30 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-amber-300 text-sm font-semibold">💎 +100 pts con membresía</p>
                <p className="text-xs text-gray-500 mt-0.5">Activa tu plan y sube de nivel al instante</p>
              </div>
              <Link
                href="/membresias"
                className="shrink-0 text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 rounded-lg font-medium transition"
              >
                Ver planes
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
