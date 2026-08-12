'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ProductForm({ onCreated }: { onCreated?: () => void }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [category, setCategory] = useState('semillas')
  const [country, setCountry] = useState('Chile')
  const [city, setCity] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) {
        setMessage('Debes iniciar sesión para publicar un producto')
        return
      }

      const images: string[] = []
      for (const file of files) {
        images.push(await fileToBase64(file))
      }

      const body = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        images,
        country: country.trim(),
        city: city.trim(),
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        setMessage('Producto creado y enviado para revisión')
        setTitle('')
        setDescription('')
        setPrice('')
        setFiles([])
        if (onCreated) onCreated()
        router.refresh()
      } else {
        const responseBody = await res.json().catch(() => null)
        setMessage(responseBody?.error || 'Error creando producto')
      }
    } catch {
      setMessage('Error de red')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-800 p-4 rounded space-y-3">
      {message && <div className="text-sm text-green-400">{message}</div>}

      <div>
        <label className="text-sm block mb-1">Título</label>
        <input className="w-full px-3 py-2 rounded bg-neutral-700" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div>
        <label className="text-sm block mb-1">Descripción</label>
        <textarea className="w-full px-3 py-2 rounded bg-neutral-700" value={description} onChange={e => setDescription(e.target.value)} required rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm block mb-1">Precio (CLP)</label>
          <input type="number" min={0} className="w-full px-3 py-2 rounded bg-neutral-700" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} required />
        </div>

        <div>
          <label className="text-sm block mb-1">Categoría</label>
          <select className="w-full px-3 py-2 rounded bg-neutral-700" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="semillas">Semillas</option>
            <option value="plantas">Plantas</option>
            <option value="herramientas">Herramientas</option>
            <option value="servicios">Servicios</option>
            <option value="otros">Otros</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm block mb-1">País</label>
          <input className="w-full px-3 py-2 rounded bg-neutral-700" value={country} onChange={e => setCountry(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm block mb-1">Ciudad</label>
          <input className="w-full px-3 py-2 rounded bg-neutral-700" value={city} onChange={e => setCity(e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="text-sm block mb-1">Imágenes (opcional)</label>
        <input type="file" accept="image/*" multiple onChange={e => setFiles(Array.from(e.target.files || []))} />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="bg-green-600 px-4 py-2 rounded font-semibold disabled:opacity-60">{saving ? 'Subiendo...' : 'Agregar producto'}</button>
      </div>
    </form>
  )
}