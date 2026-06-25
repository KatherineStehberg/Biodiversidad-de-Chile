import { NextResponse } from 'next/server';

interface USGSFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    sig: number;
    url: string;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

export async function GET() {
  try {
    const [chileRes, worldRes] = await Promise.all([
      fetch(
        'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=-60&maxlatitude=-15&minlongitude=-80&maxlongitude=-60&orderby=time&limit=8&minmagnitude=1.5',
        { next: { revalidate: 300 } }
      ),
      fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson',
        { next: { revalidate: 900 } }
      ),
    ]);

    const chileData = await chileRes.json();
    const worldData = await worldRes.json();

    const chile = chileData.features.map((f: USGSFeature) => ({
      id: f.id,
      magnitude: Math.round(f.properties.mag * 10) / 10,
      place: f.properties.place,
      time: f.properties.time,
      depth: Math.round(f.geometry.coordinates[2]),
      url: f.properties.url,
    }));

    const world = worldData.features
      .filter((f: USGSFeature) => {
        const lat = f.geometry.coordinates[1];
        const lon = f.geometry.coordinates[0];
        return !(lat >= -60 && lat <= -15 && lon >= -80 && lon <= -60);
      })
      .slice(0, 4)
      .map((f: USGSFeature) => ({
        id: f.id,
        magnitude: Math.round(f.properties.mag * 10) / 10,
        place: f.properties.place,
        time: f.properties.time,
        depth: Math.round(f.geometry.coordinates[2]),
        url: f.properties.url,
      }));

    return NextResponse.json({ chile, world });
  } catch {
    return NextResponse.json({ error: 'No se pudo obtener datos sísmicos' }, { status: 500 });
  }
}
