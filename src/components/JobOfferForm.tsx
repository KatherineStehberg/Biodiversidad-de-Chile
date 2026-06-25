'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  onCreated?: () => void
}

type Modality = 'presencial' | 'remoto' | 'híbrido'
type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'otro'

export default function JobOfferForm({ onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [salaryMin, setSalaryMin] = useState<number | undefined>()
  const [salaryMax, setSalaryMax] = useState<number | undefined>()
  const [country, setCountry] = useState('Chile')
  const [city, setCity] = useState('')
  const [modality, setModality] = useState<Modality>('remoto')
  const [employmentType, setEmploymentType] = useState<EmploymentType>('freelance')
  const [contact, setContact] = useState('')
  const [tags, setTags] = useState('')

  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const validate = () => {
    if (!title.trim()) return 'El título es obligatorio'
    if (!description.trim()) return 'La descripción es obligatoria'
    if (!contact.trim()) return 'El contacto es obligatorio'
    if (!city.trim()) return 'La ciudad es obligatoria'
    if (salaryMin && salaryMax && salaryMin > salaryMax) return 'El salario mínimo no puede ser mayor al máximo'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setSending(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          requirements: requirements.trim(),
          salaryMin,
          salaryMax,
          currency: 'CLP',
          location: { country: country.trim(), city: city.trim() },
          modality,
          employmentType,
          contact: contact.trim(),
          tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || 'No se pudo publicar la oferta')
      }

      setSent(true)
    } catch (err: any) {
      setError(err?.message || 'Error al publicar. Intenta nuevamente.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-6xl">✅</div>
        <h3 className="text-xl font-semibold text-white">¡Oferta enviada!</h3>
        <p className="text-gray-300 text-sm max-w-sm mx-auto">
          Tu oferta fue enviada para revisión. La publicaremos una vez que un administrador la apruebe. Te notificaremos por correo.
        </p>
        <button
          onClick={onCreated}
          className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Título de la oferta <span className="text-red-400">*</span>
        </label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none placeholder-gray-500"
          placeholder="Ej: Consultor en Evaluación de Impacto Ambiental"
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Descripción del cargo <span className="text-red-400">*</span>
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none placeholder-gray-500 resize-none"
          placeholder="Describe las responsabilidades y el proyecto..."
          required
        />
      </div>

      {/* Requisitos */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Requisitos</label>
        <textarea
          value={requirements}
          onChange={e => setRequirements(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none placeholder-gray-500 resize-none"
          placeholder="Experiencia, certificaciones, habilidades requeridas..."
        />
      </div>

      {/* Salario */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Rango sueldo mínimo</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              min={0}
              value={salaryMin ?? ''}
              onChange={e => setSalaryMin(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 outline-none"
              placeholder="0"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Rango sueldo máximo</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              min={0}
              value={salaryMax ?? ''}
              onChange={e => setSalaryMax(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 outline-none"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">País</label>
          <input
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 outline-none"
            placeholder="Chile"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Ciudad <span className="text-red-400">*</span>
          </label>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 outline-none"
            placeholder="Santiago"
            required
          />
        </div>
      </div>

      {/* Modalidad y Tipo */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Modalidad</label>
          <select
            value={modality}
            onChange={e => setModality(e.target.value as Modality)}
            className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 outline-none"
          >
            <option value="remoto">Remoto</option>
            <option value="presencial">Presencial</option>
            <option value="híbrido">Híbrido</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de contrato</label>
          <select
            value={employmentType}
            onChange={e => setEmploymentType(e.target.value as EmploymentType)}
            className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 outline-none"
          >
            <option value="freelance">Freelance</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Proyecto / Contrato</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      {/* Contacto */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Correo o forma de contacto <span className="text-red-400">*</span>
        </label>
        <input
          value={contact}
          onChange={e => setContact(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none placeholder-gray-500"
          placeholder="rrhh@empresa.cl"
          required
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Etiquetas <span className="text-gray-500 font-normal">(separadas por coma)</span></label>
        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-green-500 outline-none placeholder-gray-500"
          placeholder="ej: biodiversidad, EIA, flora nativa"
        />
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={sending}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Publicando...
            </span>
          ) : 'Publicar oferta'}
        </button>
        <button
          type="button"
          onClick={onCreated}
          className="px-5 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition"
        >
          Cancelar
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Tu oferta será revisada por un administrador antes de publicarse.
      </p>
    </form>
  )
}
