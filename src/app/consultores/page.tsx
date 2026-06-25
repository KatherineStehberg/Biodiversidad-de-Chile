import ConsultoresClientSection from '@/components/ConsultoresClientSection';
import PublicarOfertaSection from '@/components/PublicarOfertaSection';
import OfferGrid from '@/components/OfferGrid'
import { supabase } from '@/lib/supabase'

type UsuarioRef = { name: string; imagen_perfil: string | null }

interface ConsultorRow {
  id: string
  especialidad: string
  experiencia: string
  verificado: boolean
  created_at: string
  usuarios: UsuarioRef | UsuarioRef[]
}

interface Offer {
  id: string
  title: string
  description: string
  location: any
  salaryMin?: number
  salaryMax?: number
  modality: string
  employmentType: string
  contact: string
  tags: string[]
  isApproved: boolean
  created_at: string
  _id?: string
}

export default async function ConsultoresPage() {
  let consultoresRaw: ConsultorRow[] = []
  let offers: Offer[] = []

  try {
    const { data: consData, error: consError } = await supabase
      .from('consultores')
      .select(`
        id,
        especialidad,
        experiencia,
        verificado,
        created_at,
        usuarios!inner (
          name,
          imagen_perfil
        )
      `)
      .order('created_at', { ascending: false })
    if (!consError && consData) {
      consultoresRaw = consData as unknown as ConsultorRow[]
    }
    const showPending = process.env.OFFERS_SHOW_PENDING === 'true'
    const query = supabase
      .from('offers')
      .select('id,title,description,location,salaryMin,salaryMax,modality,employmentType,contact,tags,isApproved,created_at')
      .order('created_at', { ascending: false })
      .limit(12)
    const { data: offData, error: offError } = showPending
      ? await query
      : await query.eq('isApproved', true)
    if (!offError && offData) {
      offers = offData as unknown as Offer[]
    }
  } catch (err) {
    console.error('Error fetching consultants:', err)
  }

  const serialized = consultoresRaw.map((c) => {
    const usuario = Array.isArray(c.usuarios) ? c.usuarios[0] : c.usuarios
    return {
      id: String(c.id),
      name: usuario?.name || '',
      specialty: c.especialidad || '',
      bio: c.experiencia || '',
      image: usuario?.imagen_perfil || undefined
    }
  })

  // serialize offers for rendering
  const serializedOffers = (typeof offers !== 'undefined' ? offers : []).map((o) => ({
    id: o.id || (o._id ? o._id : o.id),
    title: o.title,
    description: o.description,
    location: o.location || {},
    salaryMin: o.salaryMin,
    salaryMax: o.salaryMax,
    modality: o.modality,
    employmentType: o.employmentType,
    contact: o.contact,
    tags: o.tags || []
  }))

  return (
    <>
      <ConsultoresClientSection items={serialized} />
      <OfferGrid items={serializedOffers} />
      
      <PublicarOfertaSection />
    </>
  );
}