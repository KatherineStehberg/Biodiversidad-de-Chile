'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Achievement,
  Level,
  COMMON,
  CONSULTANT_ONLY,
  USER_ONLY,
  evaluateAchievements,
  getLevel,
  getNextLevel,
  getLevelProgress,
} from '@/lib/gamification'

export interface GamificationState {
  loading: boolean
  points: number
  level: Level
  nextLevel: Level | null
  progress: { current: number; needed: number; pct: number }
  achievements: Achievement[]
  isConsultant: boolean
}

const INITIAL: GamificationState = {
  loading: true,
  points: 0,
  level: { name: 'Semilla', emoji: '🌱', minPts: 0, maxPts: 99, tw: 'amber' },
  nextLevel: null,
  progress: { current: 0, needed: 100, pct: 0 },
  achievements: [],
  isConsultant: false,
}

export function useGamification(): GamificationState {
  const [state, setState] = useState<GamificationState>(INITIAL)

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setState({ ...INITIAL, loading: false }); return }

        const userId = session.user.id

        // Datos del usuario
        const { data: userData } = await supabase
          .from('usuarios')
          .select('name,tipo_usuario,imagen_perfil,especialidad,membresia_activa')
          .eq('id', userId)
          .single()

        const isConsultant = ['consultor', 'consultant'].includes(userData?.tipo_usuario ?? '')

        // Datos del consultor (si aplica)
        let consultorData: any = null
        if (isConsultant) {
          const { data } = await supabase
            .from('consultores')
            .select('especialidad,experiencia,verificado')
            .eq('usuario_id', userId)
            .single()
          consultorData = data
        }

        // Conteo de actividad
        const [offersRes, resourcesRes, productsRes] = await Promise.all([
          supabase.from('offers').select('id', { count: 'exact', head: true }).eq('userId', userId),
          supabase.from('resources').select('id', { count: 'exact', head: true }).eq('author_id', userId),
          supabase.from('products').select('id', { count: 'exact', head: true }).eq('seller_id', userId),
        ])

        const counts = {
          offers: offersRes.count ?? 0,
          resources: resourcesRes.count ?? 0,
          products: productsRes.count ?? 0,
        }

        // Evaluar logros según rol
        const defs = isConsultant
          ? [...COMMON, ...CONSULTANT_ONLY]
          : [...COMMON, ...USER_ONLY]

        const achievements = evaluateAchievements(defs, userData, consultorData, counts)
        const points = achievements.filter(a => a.completed).reduce((s, a) => s + a.points, 0)

        setState({
          loading: false,
          points,
          level: getLevel(points),
          nextLevel: getNextLevel(points),
          progress: getLevelProgress(points),
          achievements,
          isConsultant,
        })
      } catch {
        setState({ ...INITIAL, loading: false })
      }
    }

    load()
  }, [])

  return state
}
