'use client'
import { useState, useEffect } from 'react'
import { FiMapPin, FiWind, FiDroplet, FiThermometer, FiAlertTriangle, FiTrendingUp, FiInfo } from 'react-icons/fi'

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  icon: string
  city: string
  country: string
}

interface ClimateData {
  co2: { value: string; year: string; month: string; abovePreIndustrial: string }
  temperature: { anomaly: string; year: string; trend10y: string }
}

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function CardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-12 w-32 rounded-lg bg-white/10 animate-pulse" />
      <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
      <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
      <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
    </div>
  )
}

export default function ClimateSection() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [climate, setClimate] = useState<ClimateData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [climateLoading, setClimateLoading] = useState(true)

  useEffect(() => {
    fetch('/api/climate')
      .then(r => r.json())
      .then(data => { setClimate(data); setClimateLoading(false) })
      .catch(() => setClimateLoading(false))

    const fetchWeather = (lat: number, lon: number) => {
      fetch(`/api/weather?lat=${lat}&lon=${lon}`)
        .then(r => r.json())
        .then(data => { setWeather(data); setWeatherLoading(false) })
        .catch(() => setWeatherLoading(false))
    }

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(-33.45, -70.66),
        { timeout: 5000 }
      )
    } else {
      fetchWeather(-33.45, -70.66)
    }
  }, [])

  const co2Value = climate ? parseFloat(climate.co2.value) : null
  const co2Color = co2Value
    ? co2Value > 420 ? 'text-orange-400' : co2Value > 400 ? 'text-yellow-400' : 'text-green-400'
    : 'text-gray-400'
  const co2BarColor = co2Value
    ? co2Value > 420 ? 'bg-orange-500' : co2Value > 400 ? 'bg-yellow-500' : 'bg-green-500'
    : 'bg-gray-500'
  const co2BarWidth = co2Value
    ? `${Math.min(100, ((co2Value - 280) / (500 - 280)) * 100).toFixed(1)}%`
    : '0%'

  const tempAnomaly = climate ? parseFloat(climate.temperature.anomaly) : null
  const tempColor = tempAnomaly
    ? tempAnomaly > 1.5 ? 'text-red-400' : tempAnomaly > 1.0 ? 'text-orange-400' : 'text-yellow-400'
    : 'text-gray-400'

  const co2DateStr = climate
    ? `${MONTHS[parseInt(climate.co2.month) - 1] ?? ''} ${climate.co2.year}`
    : ''

  return (
    <section className="relative py-20 bg-neutral-950 overflow-hidden">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-80 w-80 rounded-full bg-green-700/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 h-80 w-80 rounded-full bg-blue-700/8 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur px-4 py-1.5 text-sm font-medium text-green-300 mb-5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            Datos en tiempo real
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Estado del{' '}
            <span className="bg-gradient-to-r from-green-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Planeta
            </span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Clima local y métricas globales de cambio climático actualizadas automáticamente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Weather */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-500/10 blur-[40px] pointer-events-none" />
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Clima Local</span>
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <FiInfo size={11} /> Open-Meteo
              </span>
            </div>

            {weatherLoading ? <CardSkeleton /> : weather ? (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-5xl font-bold text-white leading-none">{weather.temperature}°C</div>
                    <div className="mt-1.5 text-sm text-gray-400">{weather.condition}</div>
                  </div>
                  <div className="text-5xl select-none">{weather.icon}</div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
                  <FiMapPin size={11} />
                  <span>{weather.city}{weather.country ? `, ${weather.country}` : ''}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <FiDroplet size={11} /> Humedad
                    </div>
                    <div className="text-sm font-semibold text-blue-300">{weather.humidity}%</div>
                  </div>
                  <div className="rounded-xl bg-white/5 px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <FiWind size={11} /> Viento
                    </div>
                    <div className="text-sm font-semibold text-blue-300">{weather.windSpeed} km/h</div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No disponible</p>
            )}
          </div>

          {/* CO2 */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-orange-500/10 blur-[40px] pointer-events-none" />
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">CO₂ Atmosférico</span>
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <FiInfo size={11} /> NOAA
              </span>
            </div>

            {climateLoading ? <CardSkeleton /> : climate ? (
              <>
                <div className="flex items-end gap-2">
                  <div className={`text-5xl font-bold leading-none ${co2Color}`}>{climate.co2.value}</div>
                  <div className="text-lg text-gray-500 mb-1">ppm</div>
                </div>
                <div className="mt-1.5 text-xs text-gray-500">{co2DateStr}</div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Nivel pre-industrial (280)</span>
                    <span className={co2Color}>{climate.co2.abovePreIndustrial}% sobre</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${co2BarColor}`}
                      style={{ width: co2BarWidth }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-700 mt-1.5">
                    <span>280</span>
                    <span className="text-green-800">350 seguro</span>
                    <span>500</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-orange-400/80">
                  <FiAlertTriangle size={11} />
                  <span>Límite seguro planetario superado</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No disponible</p>
            )}
          </div>

          {/* Temperature anomaly */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-red-500/10 blur-[40px] pointer-events-none" />
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Anomalía Térmica</span>
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <FiInfo size={11} /> NASA GISS
              </span>
            </div>

            {climateLoading ? <CardSkeleton /> : climate ? (
              <>
                <div className="flex items-end gap-2">
                  <div className={`text-5xl font-bold leading-none ${tempColor}`}>
                    +{climate.temperature.anomaly}
                  </div>
                  <div className="text-lg text-gray-500 mb-1">°C</div>
                </div>
                <div className="mt-1.5 text-xs text-gray-500">vs. promedio 1951–1980 · {climate.temperature.year}</div>

                <div className="mt-5 space-y-2.5">
                  <div className="rounded-xl bg-white/5 px-3 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FiTrendingUp size={11} /> Tendencia 10 años
                    </div>
                    <div className={`text-sm font-semibold ${parseFloat(climate.temperature.trend10y) > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                      {parseFloat(climate.temperature.trend10y) > 0 ? '+' : ''}{climate.temperature.trend10y}°C
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 px-3 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FiThermometer size={11} /> Meta Acuerdo de París
                    </div>
                    <div className="text-sm font-semibold text-yellow-400">+1.5°C</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-red-400/80">
                  <FiAlertTriangle size={11} />
                  <span>
                    {tempAnomaly && tempAnomaly >= 1.5
                      ? 'Límite del Acuerdo de París alcanzado'
                      : tempAnomaly
                        ? `${(1.5 - tempAnomaly).toFixed(2)}°C bajo el límite de París`
                        : ''}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No disponible</p>
            )}
          </div>

        </div>

        <p className="mt-8 text-center text-xs text-gray-700">
          Fuentes: Open-Meteo · NOAA Mauna Loa Observatory · NASA GISS Surface Temperature Analysis
        </p>
      </div>
    </section>
  )
}
