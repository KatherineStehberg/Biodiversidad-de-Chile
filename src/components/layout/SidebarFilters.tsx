'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getErrorMessage } from '@/lib/utils'
import { Session } from '@supabase/supabase-js'
import { FiPlus } from 'react-icons/fi'

type ProductForm = {
  title: string
  description: string
  price: string
  category: string
  city: string
  country: string
}

const CATEGORIES = ['Cosmética', 'Alimentos', 'Artesanía', 'Semillas', 'Educación', 'Otro']

function PublicarProductoModal({ onClose, session }: { onClose: () => void; session: Session }) {
  const [form, setForm] = useState<ProductForm>({
    title: '', description: '', price: '', category: 'Otro', city: '', country: 'Chile'
  })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setError('El título es obligatorio'); return }
    if (!form.description.trim()) { setError('La descripción es obligatoria'); return }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) { setError('El precio no es válido'); return }
    if (!form.city.trim()) { setError('La ciudad es obligatoria'); return }

    setSending(true)
    setError('')
    try {
      const token = session.access_token
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          category: form.category,
          city: form.city.trim(),
          country: form.country.trim(),
          images: []
        })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || 'Error al publicar')
      }
      setSent(true)
    } catch (err) {
      setError(getErrorMessage(err, 'Error al publicar el producto'))
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-6 space-y-3">
        <div className="text-5xl">✅</div>
        <h3 className="text-lg font-semibold text-white">¡Producto enviado!</h3>
        <p className="text-gray-400 text-sm">Será revisado y publicado pronto.</p>
        <button onClick={onClose} className="mt-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-colors duration-200">
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Título <span className="text-red-400">*</span></label>
        <input
          required
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white rounded-xl focus:border-green-500 outline-none placeholder-neutral-500 text-sm"
          placeholder="Ej: Shampoo de aloe vera"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Descripción <span className="text-red-400">*</span></label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white rounded-xl focus:border-green-500 outline-none resize-none placeholder-neutral-500 text-sm"
          placeholder="Describe tu producto..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Precio CLP <span className="text-red-400">*</span></label>
          <input
            type="number"
            min={0}
            required
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white rounded-xl focus:border-green-500 outline-none text-sm"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Categoría</label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white rounded-xl focus:border-green-500 outline-none text-sm"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Ciudad <span className="text-red-400">*</span></label>
          <input
            required
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white rounded-xl focus:border-green-500 outline-none placeholder-neutral-500 text-sm"
            placeholder="Santiago"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">País</label>
          <input
            value={form.country}
            onChange={e => setForm({ ...form, country: e.target.value })}
            className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white rounded-xl focus:border-green-500 outline-none placeholder-neutral-500 text-sm"
            placeholder="Chile"
          />
        </div>
      </div>
      {error && (
        <div className="bg-red-900/30 border border-red-800/60 text-red-300 text-sm px-3 py-2 rounded-xl">{error}</div>
      )}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={sending}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 disabled:opacity-50 text-sm"
        >
          {sending ? 'Publicando...' : 'Publicar'}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors duration-200 text-sm">
          Cancelar
        </button>
      </div>
      <p className="text-xs text-gray-600 text-center">Será revisado antes de publicarse.</p>
    </form>
  )
}

const SidebarFilters = () => {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data.session)
      setLoadingSession(false)
    }).catch(() => setLoadingSession(false))
  }, [])

  function handlePublicar() {
    if (!session) {
      router.push('/login')
    } else {
      setModalOpen(true)
    }
  }

  const cats = [
    { icon: '🌐', name: 'Todo' },
    { icon: '🧴', name: 'Cosmética' },
    { icon: '🍎', name: 'Alimentos' },
    { icon: '👐', name: 'Artesanía' },
    { icon: '🌱', name: 'Semillas' },
    { icon: '📚', name: 'Educación' },
  ]

  return (
    <>
      <aside className="w-full md:w-[260px] flex-shrink-0 space-y-6 p-5 bg-neutral-900 rounded-2xl text-white border border-neutral-800 self-start">
        {/* CATEGORÍAS */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Categorías</h4>
          <div className="space-y-1">
            {cats.map((cat) => (
              <button
                key={cat.name}
                className="w-full text-left px-3 py-2 rounded-xl bg-neutral-800/50 hover:bg-green-900/30 hover:text-green-300 transition-all duration-200 flex items-center gap-2.5 text-sm text-gray-300 cursor-pointer"
              >
                <span className="text-base">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* UBICACIÓN */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Ubicación</h4>
          <select className="w-full px-3 py-2.5 bg-neutral-800 text-gray-300 rounded-xl border border-neutral-700 text-sm outline-none focus:border-green-600 cursor-pointer">
            <option value="">Todas las regiones</option>
            <option value="metropolitana">Metropolitana</option>
            <option value="valparaiso">Valparaíso</option>
            <option value="antofagasta">Antofagasta</option>
            <option value="biobio">Biobío</option>
          </select>
        </div>

        {/* PRECIO */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Precio</h4>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Mínimo $0"
              className="w-full px-3 py-2.5 bg-neutral-800 text-gray-300 rounded-xl border border-neutral-700 text-sm outline-none focus:border-green-600 placeholder-neutral-600"
            />
            <input
              type="number"
              placeholder="Máximo $100.000"
              className="w-full px-3 py-2.5 bg-neutral-800 text-gray-300 rounded-xl border border-neutral-700 text-sm outline-none focus:border-green-600 placeholder-neutral-600"
            />
          </div>
        </div>

        {/* FILTROS */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Filtros</h4>
          <div className="space-y-2">
            {['Envío gratis', 'Producto certificado', 'En stock', 'Solo emprendedores'].map((filtro) => (
              <label key={filtro} className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded accent-green-500 cursor-pointer" />
                <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-150">{filtro}</span>
              </label>
            ))}
          </div>
        </div>

        {/* POPULARES */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Populares</h4>
          <ul className="space-y-1.5 text-sm text-gray-400">
            <li className="flex items-center gap-2"><span>⭐</span> Shampoo de aloe vera</li>
            <li className="flex items-center gap-2"><span>🔥</span> Compostera urbana</li>
            <li className="flex items-center gap-2"><span>🍃</span> Semillas de albahaca</li>
          </ul>
        </div>

        {/* BOTÓN PUBLICAR */}
        <div>
          <button
            onClick={handlePublicar}
            disabled={loadingSession}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 cursor-pointer disabled:opacity-60"
          >
            <FiPlus size={16} />
            Publicar producto
          </button>
          {!loadingSession && !session && (
            <p className="text-xs text-gray-600 text-center mt-1.5">Necesitas una cuenta para publicar</p>
          )}
        </div>
      </aside>

      {/* Modal */}
      {modalOpen && session && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold">Publicar producto</h2>
                <p className="text-xs text-gray-500">Mercado ecológico sustentable</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition-all duration-200 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="px-6 py-5">
              <PublicarProductoModal onClose={() => setModalOpen(false)} session={session} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SidebarFilters
