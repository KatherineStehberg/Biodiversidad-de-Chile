import { NextResponse } from 'next/server';

interface GBIFOccurrence {
  key: number;
  scientificName: string;
  species?: string;
  vernacularName?: string;
  kingdom?: string;
  class?: string;
  stateProvince?: string;
  locality?: string;
  eventDate?: string;
  media?: Array<{ type: string; identifier?: string }>;
}

interface EONETEvent {
  id: string;
  title: string;
  categories: Array<{ id: string; title: string }>;
  geometry: Array<{ date: string }>;
}

const CATEGORY_ICONS: Record<string, string> = {
  wildfires: '🔥',
  volcanoes: '🌋',
  floods: '🌊',
  storms: '⛈️',
  earthquakes: '⚡',
  landslides: '⛰️',
  drought: '🏜️',
  seaLakeIce: '🧊',
  snow: '❄️',
  waterColor: '💧',
  dustHaze: '🌫️',
};

export async function GET() {
  try {
    const [gbifRes, eonetRes] = await Promise.all([
      fetch(
        'https://api.gbif.org/v1/occurrence/search?country=CL&limit=6&hasCoordinate=true&mediaType=StillImage&basisOfRecord=HUMAN_OBSERVATION&taxonKey=1',
        { next: { revalidate: 3600 } }
      ),
      fetch(
        'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=8&days=30',
        { next: { revalidate: 3600 } }
      ),
    ]);

    const gbifData = await gbifRes.json();
    const eonetData = await eonetRes.json();

    const species = (gbifData.results as GBIFOccurrence[])
      .filter(occ => occ.media?.some(m => m.type === 'StillImage' && m.identifier))
      .slice(0, 6)
      .map(occ => ({
        id: occ.key,
        name: occ.species ?? occ.scientificName,
        commonName: occ.vernacularName ?? null,
        kingdom: occ.kingdom ?? null,
        class: occ.class ?? null,
        region: occ.stateProvince ?? occ.locality ?? 'Chile',
        date: occ.eventDate ? occ.eventDate.slice(0, 10) : null,
        image: occ.media?.find(m => m.type === 'StillImage' && m.identifier)?.identifier ?? null,
      }));

    const events = (eonetData.events as EONETEvent[])
      .filter(e => e.geometry?.length > 0)
      .slice(0, 6)
      .map(e => ({
        id: e.id,
        title: e.title,
        category: e.categories[0]?.title ?? 'Evento natural',
        categoryId: e.categories[0]?.id ?? '',
        icon: CATEGORY_ICONS[e.categories[0]?.id ?? ''] ?? '🌍',
        date: e.geometry[e.geometry.length - 1]?.date ?? null,
      }));

    return NextResponse.json({ species, events });
  } catch {
    return NextResponse.json({ error: 'No se pudo obtener datos de biodiversidad' }, { status: 500 });
  }
}
