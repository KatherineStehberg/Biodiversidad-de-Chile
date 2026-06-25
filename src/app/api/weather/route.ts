import { NextRequest, NextResponse } from 'next/server';

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Despejado',            icon: '☀️'  },
  1:  { label: 'Mayormente despejado', icon: '🌤️'  },
  2:  { label: 'Parcialmente nublado', icon: '⛅'  },
  3:  { label: 'Nublado',              icon: '☁️'  },
  45: { label: 'Niebla',               icon: '🌫️'  },
  48: { label: 'Niebla con escarcha',  icon: '🌫️'  },
  51: { label: 'Llovizna ligera',      icon: '🌦️'  },
  53: { label: 'Llovizna moderada',    icon: '🌦️'  },
  55: { label: 'Llovizna intensa',     icon: '🌧️'  },
  61: { label: 'Lluvia ligera',        icon: '🌧️'  },
  63: { label: 'Lluvia moderada',      icon: '🌧️'  },
  65: { label: 'Lluvia intensa',       icon: '🌧️'  },
  71: { label: 'Nieve ligera',         icon: '🌨️'  },
  73: { label: 'Nieve moderada',       icon: '❄️'  },
  75: { label: 'Nieve intensa',        icon: '❄️'  },
  80: { label: 'Chubascos ligeros',    icon: '🌦️'  },
  81: { label: 'Chubascos moderados',  icon: '🌧️'  },
  82: { label: 'Chubascos intensos',   icon: '⛈️'  },
  95: { label: 'Tormenta',             icon: '⛈️'  },
  99: { label: 'Tormenta con granizo', icon: '⛈️'  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat') ?? '-33.45';
  const lon = searchParams.get('lon') ?? '-70.66';

  try {
    const [weatherRes, geoRes] = await Promise.all([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`,
        { next: { revalidate: 1800 } }
      ),
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {
          headers: { 'User-Agent': 'biodiversidad-platform/1.0' },
          next: { revalidate: 86400 },
        }
      ),
    ]);

    const weatherData = await weatherRes.json();
    const geoData = await geoRes.json();

    const code = weatherData.current.weather_code as number;
    const weather = WMO_CODES[code] ?? { label: 'Variable', icon: '🌡️' };
    const addr = geoData.address ?? {};
    const city = addr.city ?? addr.town ?? addr.village ?? addr.county ?? 'Tu ubicación';
    const country = addr.country ?? '';

    return NextResponse.json({
      temperature: Math.round(weatherData.current.temperature_2m),
      humidity: weatherData.current.relative_humidity_2m,
      windSpeed: Math.round(weatherData.current.wind_speed_10m),
      condition: weather.label,
      icon: weather.icon,
      city,
      country,
    });
  } catch {
    return NextResponse.json({ error: 'No se pudo obtener el clima' }, { status: 500 });
  }
}
