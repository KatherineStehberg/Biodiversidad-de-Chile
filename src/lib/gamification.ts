// ============================================================
// Sistema de gamificación — Biodiversidad.cl
// Puntos, niveles y logros por rol
// ============================================================

export interface Level {
  name: string
  emoji: string
  minPts: number
  maxPts: number
  tw: string // tailwind color token (sin prefijo)
}

export const LEVELS: Level[] = [
  { name: 'Semilla',      emoji: '🌱', minPts: 0,    maxPts: 99,       tw: 'amber' },
  { name: 'Brote',        emoji: '🌿', minPts: 100,  maxPts: 299,      tw: 'green' },
  { name: 'Árbol Nativo', emoji: '🌲', minPts: 300,  maxPts: 699,      tw: 'emerald' },
  { name: 'Bosque',       emoji: '🌳', minPts: 700,  maxPts: 1499,     tw: 'teal' },
  { name: 'Ecosistema',   emoji: '🏔️', minPts: 1500, maxPts: Infinity, tw: 'cyan' },
]

export type AchievementCategory = 'perfil' | 'actividad' | 'comunidad'

export interface AchievementDef {
  id: string
  label: string
  description: string
  points: number
  emoji: string
  category: AchievementCategory
}

export interface Achievement extends AchievementDef {
  completed: boolean
}

export interface GamificationUserData {
  name?: string | null
  imagen_perfil?: string | null
  membresia_activa?: boolean | null
  especialidad?: string | null
}

export interface GamificationConsultantData {
  especialidad?: string | null
  experiencia?: string | null
  verificado?: boolean | null
}

// ── Logros compartidos para todos los roles ────────────────
export const COMMON: AchievementDef[] = [
  {
    id: 'register',
    label: 'Bienvenido/a a la comunidad',
    description: 'Crear una cuenta en la plataforma',
    points: 20,
    emoji: '🎉',
    category: 'perfil',
  },
  {
    id: 'name',
    label: 'Nombre completo',
    description: 'Completar tu nombre en el perfil',
    points: 30,
    emoji: '👤',
    category: 'perfil',
  },
  {
    id: 'photo',
    label: 'Foto de perfil',
    description: 'Subir una foto de perfil',
    points: 50,
    emoji: '📸',
    category: 'perfil',
  },
  {
    id: 'membership',
    label: 'Miembro activo',
    description: 'Activar una membresía en la plataforma',
    points: 100,
    emoji: '💎',
    category: 'comunidad',
  },
  {
    id: 'first_offer',
    label: 'Primera oferta publicada',
    description: 'Publicar una oferta laboral',
    points: 40,
    emoji: '💼',
    category: 'actividad',
  },
  {
    id: 'first_resource',
    label: 'Recurso compartido',
    description: 'Subir un recurso educativo a la comunidad',
    points: 30,
    emoji: '📚',
    category: 'actividad',
  },
]

// ── Logros exclusivos para consultores ────────────────────
export const CONSULTANT_ONLY: AchievementDef[] = [
  {
    id: 'especialidad',
    label: 'Especialidad definida',
    description: 'Indicar tu área de especialización ambiental',
    points: 25,
    emoji: '🔬',
    category: 'perfil',
  },
  {
    id: 'experiencia',
    label: 'Experiencia descrita',
    description: 'Escribir tu experiencia profesional',
    points: 50,
    emoji: '📝',
    category: 'perfil',
  },
  {
    id: 'verified',
    label: 'Cuenta verificada',
    description: 'Ser verificado/a por el equipo de Biodiversidad.cl',
    points: 100,
    emoji: '✅',
    category: 'comunidad',
  },
  {
    id: 'five_resources',
    label: '5 recursos compartidos',
    description: 'Contribuir con 5 recursos educativos a la comunidad',
    points: 75,
    emoji: '📖',
    category: 'comunidad',
  },
]

// ── Logros exclusivos para usuarios regulares ─────────────
export const USER_ONLY: AchievementDef[] = [
  {
    id: 'first_product',
    label: 'Producto en Marketplace',
    description: 'Publicar un producto en el marketplace',
    points: 35,
    emoji: '🛒',
    category: 'actividad',
  },
  {
    id: 'explore_consultores',
    label: 'Red explorada',
    description: 'Visitar la sección de consultores',
    points: 10,
    emoji: '🔍',
    category: 'actividad',
  },
]

// ── Helpers ───────────────────────────────────────────────
export function getLevel(pts: number): Level {
  return LEVELS.find(l => pts >= l.minPts && pts <= l.maxPts) ?? LEVELS[0]
}

export function getNextLevel(pts: number): Level | null {
  const idx = LEVELS.findIndex(l => pts >= l.minPts && pts <= l.maxPts)
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null
}

export function getLevelProgress(pts: number): { current: number; needed: number; pct: number } {
  const level = getLevel(pts)
  if (level.maxPts === Infinity) return { current: 0, needed: 0, pct: 100 }
  const range = level.maxPts - level.minPts + 1
  const current = pts - level.minPts
  return { current, needed: range, pct: Math.min(100, Math.round((current / range) * 100)) }
}

// ── Evaluación de logros ──────────────────────────────────
export function evaluateAchievements(
  defs: AchievementDef[],
  userData: GamificationUserData | null,
  consultorData: GamificationConsultantData | null,
  counts: { offers: number; resources: number; products: number }
): Achievement[] {
  return defs.map(def => {
    let completed = false
    switch (def.id) {
      case 'register':          completed = true; break
      case 'name':              completed = !!(userData?.name?.trim()?.length > 2); break
      case 'photo':             completed = !!userData?.imagen_perfil; break
      case 'membership':        completed = !!userData?.membresia_activa; break
      case 'especialidad':      completed = !!(consultorData?.especialidad || userData?.especialidad); break
      case 'experiencia':       completed = !!(consultorData?.experiencia?.length > 20); break
      case 'verified':          completed = !!consultorData?.verificado; break
      case 'first_offer':       completed = counts.offers > 0; break
      case 'first_resource':    completed = counts.resources > 0; break
      case 'five_resources':    completed = counts.resources >= 5; break
      case 'first_product':     completed = counts.products > 0; break
      case 'explore_consultores': completed = typeof window !== 'undefined' && !!localStorage.getItem('visited_consultores'); break
    }
    return { ...def, completed }
  })
}
