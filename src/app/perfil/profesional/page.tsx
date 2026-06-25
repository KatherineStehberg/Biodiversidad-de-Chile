'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProfileLayout from '@/components/layout/ProfileLayout'
import { FaLinkedin, FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'
import { FiUpload, FiFileText, FiExternalLink } from 'react-icons/fi'

export default function ProfessionalProfilePage() {
  return (
    <ProfileLayout>
      <ProfessionalForm />
    </ProfileLayout>
  )
}

function ProfessionalForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingCV, setUploadingCV] = useState(false)
  const [message, setMessage] = useState('')
  const cvInputRef = useRef<HTMLInputElement>(null)

  const [role, setRole] = useState('user')
  const [formData, setFormData] = useState({
    especialidad: '',
    experiencia: '',
    cv_url: '',
    portfolio_url: '',
    certificaciones: '',
    linkedin_url: '',
    instagram_url: '',
    facebook_url: '',
    tiktok_url: '',
  })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [userRes, consultorRes] = await Promise.all([
        supabase
          .from('usuarios')
          .select('tipo_usuario,linkedin_url,instagram_url,facebook_url,tiktok_url')
          .eq('id', user.id)
          .single(),
        supabase
          .from('consultores')
          .select('especialidad,experiencia,cv_url,portfolio_url,certificaciones')
          .eq('usuario_id', user.id)
          .single(),
      ])

      const userData = userRes.data
      const consultantData = consultorRes.data

      if (userData?.tipo_usuario) {
        setRole(userData.tipo_usuario === 'consultor' ? 'consultant' : userData.tipo_usuario)
      }

      setFormData({
        especialidad: consultantData?.especialidad || '',
        experiencia: consultantData?.experiencia || '',
        cv_url: consultantData?.cv_url || '',
        portfolio_url: consultantData?.portfolio_url || '',
        certificaciones: consultantData?.certificaciones || '',
        linkedin_url: userData?.linkedin_url || '',
        instagram_url: userData?.instagram_url || '',
        facebook_url: userData?.facebook_url || '',
        tiktok_url: userData?.tiktok_url || '',
      })
    } catch (e) {
      console.error('Error loading data', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleCVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCV(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Sin sesión')
      const path = `cvs/${user.id}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('documentos').upload(path, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('documentos').getPublicUrl(path)
      setFormData(prev => ({ ...prev, cv_url: publicUrl }))
    } catch (err: any) {
      setMessage('Error al subir CV: ' + (err.message || 'intenta de nuevo'))
    } finally {
      setUploadingCV(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role, ...formData }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error al guardar')

      setMessage('Perfil actualizado correctamente')
      router.refresh()
    } catch (err: any) {
      setMessage(err.message || 'Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-white text-sm p-6">Cargando datos...</div>

  const isConsultant = role === 'consultant'

  return (
    <div className="space-y-5">
      {message && (
        <div className={`p-3 rounded-lg text-sm border ${
          message.includes('Error')
            ? 'bg-red-900/40 text-red-200 border-red-800/30'
            : 'bg-green-900/40 text-green-200 border-green-800/30'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Tipo de perfil ── */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Tipo de Perfil</h2>
          <div className="flex gap-3">
            <label className={`flex-1 cursor-pointer p-4 rounded-lg border transition ${
              !isConsultant
                ? 'border-green-500 bg-green-900/20'
                : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
            }`}>
              <input type="radio" name="role" value="user" checked={!isConsultant}
                onChange={() => setRole('user')} className="sr-only" />
              <div className="text-center">
                <div className="font-semibold text-white text-sm">Usuario / Reclutador</div>
                <div className="text-xs text-gray-400 mt-1">Busco servicios o productos</div>
              </div>
            </label>
            <label className={`flex-1 cursor-pointer p-4 rounded-lg border transition ${
              isConsultant
                ? 'border-green-500 bg-green-900/20'
                : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
            }`}>
              <input type="radio" name="role" value="consultant" checked={isConsultant}
                onChange={() => setRole('consultant')} className="sr-only" />
              <div className="text-center">
                <div className="font-semibold text-white text-sm">Consultor Ambiental</div>
                <div className="text-xs text-gray-400 mt-1">Ofrezco servicios profesionales</div>
              </div>
            </label>
          </div>
        </div>

        {/* ── Datos de consultor ── */}
        {isConsultant && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <h2 className="text-green-400 font-semibold">Información Profesional</h2>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Especialidad Principal</label>
              <input
                type="text"
                value={formData.especialidad}
                onChange={e => setFormData({ ...formData, especialidad: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-800 rounded-lg border border-neutral-700 focus:border-green-500 outline-none text-white text-sm"
                placeholder="Ej: Evaluación de Impacto Ambiental"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Experiencia y Biografía</label>
              <textarea
                value={formData.experiencia}
                onChange={e => setFormData({ ...formData, experiencia: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 bg-neutral-800 rounded-lg border border-neutral-700 focus:border-green-500 outline-none text-white text-sm resize-none"
                placeholder="Describe tu experiencia, años de trabajo y áreas de enfoque..."
                required
              />
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Currículum Vitae (CV)</label>
              <div className="space-y-2">
                {formData.cv_url && (
                  <a
                    href={formData.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-green-900/20 border border-green-800/30 rounded-lg text-sm text-green-400 hover:text-green-300 transition w-fit"
                  >
                    <FiFileText size={14} />
                    <span>Ver CV actual</span>
                    <FiExternalLink size={12} />
                  </a>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    disabled={uploadingCV}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-300 rounded-lg text-sm transition disabled:opacity-50"
                  >
                    <FiUpload size={14} />
                    {uploadingCV ? 'Subiendo...' : 'Subir PDF / Word'}
                  </button>
                  <input ref={cvInputRef} type="file" accept=".pdf,.doc,.docx"
                    onChange={handleCVUpload} className="hidden" />
                  <span className="text-gray-600 text-xs">o pega un enlace directo</span>
                </div>
                <input
                  type="url"
                  value={formData.cv_url}
                  onChange={e => setFormData({ ...formData, cv_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-800 rounded-lg border border-neutral-700 focus:border-green-500 outline-none text-white text-sm"
                  placeholder="https://drive.google.com/... o enlace de LinkedIn"
                />
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Portafolio</label>
              <input
                type="url"
                value={formData.portfolio_url}
                onChange={e => setFormData({ ...formData, portfolio_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-800 rounded-lg border border-neutral-700 focus:border-green-500 outline-none text-white text-sm"
                placeholder="https://miweb.cl o https://behance.net/tu-perfil"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Certificaciones</label>
              <textarea
                value={formData.certificaciones}
                onChange={e => setFormData({ ...formData, certificaciones: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-neutral-800 rounded-lg border border-neutral-700 focus:border-green-500 outline-none text-white text-sm resize-none"
                placeholder="Lista tus certificaciones relevantes..."
              />
            </div>
          </div>
        )}

        {/* ── Redes sociales (todos los usuarios) ── */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-white font-semibold">Redes Sociales</h2>
            <p className="text-gray-500 text-xs mt-1">Visibles en tu perfil público para que la comunidad pueda contactarte.</p>
          </div>

          <div className="space-y-3">
            {/* LinkedIn */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center shrink-0">
                <FaLinkedin className="text-blue-400" size={16} />
              </div>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="flex-1 px-4 py-2.5 bg-neutral-800 rounded-lg border border-neutral-700 focus:border-blue-500 outline-none text-white text-sm"
                placeholder="https://linkedin.com/in/tu-perfil"
              />
            </div>

            {/* Instagram */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-pink-950/60 border border-pink-800/40 flex items-center justify-center shrink-0">
                <FaInstagram className="text-pink-400" size={16} />
              </div>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={e => setFormData({ ...formData, instagram_url: e.target.value })}
                className="flex-1 px-4 py-2.5 bg-neutral-800 rounded-lg border border-neutral-700 focus:border-pink-500 outline-none text-white text-sm"
                placeholder="https://instagram.com/tu-usuario"
              />
            </div>

            {/* Facebook */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-950/40 border border-blue-900/40 flex items-center justify-center shrink-0">
                <FaFacebook className="text-blue-500" size={16} />
              </div>
              <input
                type="url"
                value={formData.facebook_url}
                onChange={e => setFormData({ ...formData, facebook_url: e.target.value })}
                className="flex-1 px-4 py-2.5 bg-neutral-800 rounded-lg border border-neutral-700 focus:border-blue-500 outline-none text-white text-sm"
                placeholder="https://facebook.com/tu-pagina"
              />
            </div>

            {/* TikTok */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                <FaTiktok className="text-white" size={16} />
              </div>
              <input
                type="url"
                value={formData.tiktok_url}
                onChange={e => setFormData({ ...formData, tiktok_url: e.target.value })}
                className="flex-1 px-4 py-2.5 bg-neutral-800 rounded-lg border border-neutral-700 focus:border-neutral-500 outline-none text-white text-sm"
                placeholder="https://tiktok.com/@tu-usuario"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pb-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
