// ============================================================
// MOCK SUPABASE CLIENT para desarrollo local sin credenciales
// Activar con NEXT_PUBLIC_USE_MOCK_DATA=true en .env.local
// ============================================================

import {
  MOCK_AUTH_USERS,
  MOCK_CONSULTORES,
  MOCK_OFFERS,
  MOCK_PRODUCTS,
  MOCK_RESOURCES,
  MOCK_USUARIOS,
} from './mock-data'

// ── Tablas disponibles ─────────────────────────────────────
type JsonRecord = Record<string, unknown>

type MockUser = {
  id: string
  email: string
  name: string
  password?: string
  tipo_usuario?: string
}

type MockSession = ReturnType<typeof createSession>

type SignUpArgs = {
  email: string
  password: string
  options?: { data?: { name?: string } }
}

type OAuthArgs = {
  provider: string
  options?: { redirectTo?: string }
}

const TABLES: Record<string, readonly unknown[]> = {
  consultores: MOCK_CONSULTORES,
  offers: MOCK_OFFERS,
  products: MOCK_PRODUCTS,
  resources: MOCK_RESOURCES,
  usuarios: MOCK_USUARIOS,
}

// ── Gestión de sesión ──────────────────────────────────────
const AUTH_LISTENERS: Array<(event: string, session: MockSession | null) => void> = []

function createSession(user: { id: string; email: string; name: string }) {
  return {
    access_token: `mock-token-${user.id}`,
    refresh_token: `mock-refresh-${user.id}`,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: {
      id: user.id,
      email: user.email,
      user_metadata: { name: user.name, full_name: user.name },
      app_metadata: {},
      identities: [],
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    },
  }
}

function loadSession(): MockSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('mock_session')
    return raw ? JSON.parse(raw) as MockSession : null
  } catch { return null }
}

function persistSession(session: MockSession | null) {
  if (typeof window === 'undefined') return
  if (session) localStorage.setItem('mock_session', JSON.stringify(session))
  else localStorage.removeItem('mock_session')
}

function broadcast(event: string, session: MockSession | null) {
  AUTH_LISTENERS.forEach(cb => cb(event, session))
}

// Usuarios registrados en sesión actual (solo cliente)
function getLocalUsers(): MockUser[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('mock_registered_users') || '[]') as MockUser[]
  } catch { return [] }
}

function addLocalUser(user: MockUser) {
  if (typeof window === 'undefined') return
  const users = getLocalUsers()
  users.push(user)
  localStorage.setItem('mock_registered_users', JSON.stringify(users))
}

// ── Query builder ──────────────────────────────────────────
class MockQueryBuilder {
  private _data: unknown[]
  private _filters: Array<(item: unknown) => boolean> = []
  private _orderField: string | null = null
  private _orderAsc = true
  private _limit: number | null = null
  private _rangeFrom: number | null = null
  private _rangeTo: number | null = null
  private _single = false
  private _countExact = false
  private _headOnly = false
  private _op: 'select' | 'insert' | 'update' | 'delete' = 'select'
  private _insertValues: unknown = null

  constructor(table: string) {
    this._data = [...(TABLES[table] ?? [])]
  }

  select(_fields?: string, opts?: { count?: string; head?: boolean }) {
    void _fields
    if (opts?.count === 'exact') this._countExact = true
    if (opts?.head) this._headOnly = true
    return this
  }

  eq(field: string, value: unknown) {
    this._filters.push(item => String((item as JsonRecord)[field]) === String(value))
    return this
  }

  neq(field: string, value: unknown) {
    this._filters.push(item => String((item as JsonRecord)[field]) !== String(value))
    return this
  }

  in(field: string, values: unknown[]) {
    const sv = values.map(String)
    this._filters.push(item => sv.includes(String((item as JsonRecord)[field])))
    return this
  }

  order(field: string, { ascending = true } = {}) {
    this._orderField = field
    this._orderAsc = ascending
    return this
  }

  limit(n: number) { this._limit = n; return this }

  range(from: number, to: number) {
    this._rangeFrom = from
    this._rangeTo = to
    return this
  }

  single() { this._single = true; return this }

  insert(values: unknown) { this._op = 'insert'; this._insertValues = values; return this }
  update(values: unknown) { void values; this._op = 'update'; return this }
  delete() { this._op = 'delete'; return this }

  // Permite await sobre el builder
  then<TResult1 = unknown, TResult2 = never>(
    resolve?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
    reject?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    void reject
    const fulfill = resolve ?? ((value: unknown) => value as TResult1)
    if (this._op === 'insert') {
      const arr = Array.isArray(this._insertValues) ? this._insertValues : [this._insertValues]
      const withMeta = arr.map(value => ({
        id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        created_at: new Date().toISOString(),
        ...(value as JsonRecord),
      }))
      return Promise.resolve(fulfill({ data: this._single ? withMeta[0] : withMeta, error: null }))
    }

    if (this._op === 'update' || this._op === 'delete') {
      return Promise.resolve(fulfill({ data: [], error: null }))
    }

    // SELECT
    let result = [...this._data]

    for (const f of this._filters) result = result.filter(f)

    if (this._orderField) {
      const field = this._orderField
      const asc = this._orderAsc
      result.sort((a, b) => {
        const av = (a as JsonRecord)[field] ?? ''
        const bv = (b as JsonRecord)[field] ?? ''
        if (av < bv) return asc ? -1 : 1
        if (av > bv) return asc ? 1 : -1
        return 0
      })
    }

    if (this._limit !== null) result = result.slice(0, this._limit)

    if (this._rangeFrom !== null && this._rangeTo !== null) {
      result = result.slice(this._rangeFrom, this._rangeTo + 1)
    }

    if (this._countExact) {
      return Promise.resolve(fulfill({ data: this._headOnly ? null : result, count: this._data.length, error: null }))
    } else if (this._single) {
      return Promise.resolve(fulfill({ data: result[0] ?? null, error: null }))
    } else {
      return Promise.resolve(fulfill({ data: result, error: null }))
    }
  }
}

// ── Auth mock ──────────────────────────────────────────────
const mockAuth = {
  async getSession() {
    return { data: { session: loadSession() }, error: null }
  },

  async getUser() {
    const session = loadSession()
    return { data: { user: session?.user ?? null }, error: null }
  },

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const all = [...MOCK_AUTH_USERS, ...getLocalUsers()]
    const found = all.find(u => u.email === email && u.password === password)
    if (!found) {
      return {
        data: { session: null },
        error: {
          message:
            'Credenciales incorrectas. Prueba con:\n• consultor@test.cl / test123\n• usuario@test.cl / test123',
        },
      }
    }
    const session = createSession(found)
    persistSession(session)
    broadcast('SIGNED_IN', session)
    return { data: { session }, error: null }
  },

  async signUp({ email, password, options }: SignUpArgs) {
    const all = [...MOCK_AUTH_USERS, ...getLocalUsers()]
    if (all.find(u => u.email === email)) {
      return { data: { user: null }, error: { message: 'Este correo ya está registrado' } }
    }
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name: options?.data?.name || email.split('@')[0],
      tipo_usuario: 'usuario_regular',
    }
    addLocalUser(newUser)
    // En modo mock: auto-confirmar y redirigir al dashboard sin necesidad de correo
    const session = createSession(newUser)
    persistSession(session)
    broadcast('SIGNED_IN', session)
    if (typeof window !== 'undefined') {
      setTimeout(() => { window.location.href = '/dashboard' }, 200)
    }
    return { data: { user: { id: newUser.id, email } }, error: null }
  },

  async signOut() {
    persistSession(null)
    broadcast('SIGNED_OUT', null)
    return { error: null }
  },

  async signInWithOAuth({ provider, options }: OAuthArgs) {
    // En modo mock, simula OAuth creando sesión inmediata
    const mockOAuthUser = {
      id: `oauth-${Date.now()}`,
      email: 'google@test.cl',
      name: 'Usuario Google (Mock)',
      tipo_usuario: 'usuario_regular',
    }
    const session = createSession(mockOAuthUser)
    persistSession(session)
    broadcast('SIGNED_IN', session)
    if (typeof window !== 'undefined') {
      const dest = options?.redirectTo || '/'
      setTimeout(() => { window.location.href = dest }, 150)
    }
    return { data: { provider, url: options?.redirectTo || '/' }, error: null }
  },

  async updateUser(attrs: JsonRecord) {
    void attrs
    return { data: { user: loadSession()?.user ?? null }, error: null }
  },

  async resend(attrs: JsonRecord) {
    void attrs
    return { data: {}, error: null }
  },

  onAuthStateChange(callback: (event: string, session: MockSession | null) => void) {
    AUTH_LISTENERS.push(callback)
    // Notifica inmediatamente con el estado actual (igual que Supabase real)
    const current = loadSession()
    setTimeout(() => callback('INITIAL_SESSION', current), 0)
    return {
      data: {
        subscription: {
          unsubscribe() {
            const i = AUTH_LISTENERS.indexOf(callback)
            if (i > -1) AUTH_LISTENERS.splice(i, 1)
          },
        },
      },
    }
  },
}

// ── Storage mock ───────────────────────────────────────────
const mockStorage = {
  from: (bucket: string) => {
    void bucket
    return {
      upload: async (path: string, file: unknown) => {
        void file
        return { data: { path }, error: null }
      },
      getPublicUrl: (path: string) => {
        void path
        return { data: { publicUrl: '/assets/blog-1.png' } }
      },
      remove: async (paths: string[]) => {
        void paths
        return { data: {}, error: null }
      },
    }
  },
}

// ── Cliente final ──────────────────────────────────────────
export const mockSupabase = {
  from: (table: string) => new MockQueryBuilder(table),
  auth: mockAuth,
  storage: mockStorage,
}
