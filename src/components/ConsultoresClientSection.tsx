'use client'

import { useState } from 'react'
import HeroConsultores from './HeroConsultores'
import ConsultantGrid from './ConsultantGrid'
import type { ConsultantSummary } from '@/types/consultant'

interface Filters {
  specialty: string
  modality: string
}

export default function ConsultoresClientSection({ items }: { items: ConsultantSummary[] }) {
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
