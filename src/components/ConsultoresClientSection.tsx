'use client'

import { useState } from 'react'
import HeroConsultores from './HeroConsultores'
import ConsultantGrid from './ConsultantGrid'

interface ConsultantItem {
  id: string
  name: string
  specialty?: string
  bio?: string
  image?: string
}

interface Filters {
  specialty: string
  modality: string
}

export default function ConsultoresClientSection({ items }: { items: ConsultantItem[] }) {
  const [filters, setFilters] = useState<Filters>({ specialty: '', modality: '' })

  const filtered = items.filter(c => {
    if (filters.specialty && !c.specialty?.toLowerCase().includes(filters.specialty.toLowerCase())) return false
    return true
  })

  return (
    <>
      <HeroConsultores filters={filters} onFilterChange={setFilters} />
      <ConsultantGrid items={filtered} />
    </>
  )
}
