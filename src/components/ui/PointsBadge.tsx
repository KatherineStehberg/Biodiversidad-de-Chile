'use client'

import { useGamification } from '@/hooks/useGamification'

export default function PointsBadge() {
  const { loading, points, level } = useGamification()

  if (loading) return <div className="h-6 w-20 bg-neutral-800 animate-pulse rounded-full" />

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900/30 text-green-300 border border-green-800/40">
      <span>{level.emoji}</span>
      <span>{points} pts</span>
    </span>
  )
}
