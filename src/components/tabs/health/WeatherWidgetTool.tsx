import React, { useCallback, useEffect, useState } from 'react';
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  Compass,
  Droplets,
  MapPin,
  Search,
  Sun,
  Wind,
} from 'lucide-react';
import { readJson, STORAGE_KEYS, writeJson } from '../../../utils/storage';

interface WeatherLocation {
  name: string;
  country?: string;
  lat: number;
  lon: number;
}

interface WeatherForecastData {
  locationName: string;
  lat: number;
  lon: number;
  fetchedAt: string;
  current: {
    tempC: number;
    apparentC: number;
    humidity: number;
    windKmh: number;
    weatherCode: number;
  };
  daily: Array<{
    date: string;
    code: number;
    maxC: number;
    minC: number;
  }>;
}

const DEFAULT_LOCATION: WeatherLocation = {
  name: 'San Pablo City',
  country: 'Philippines',
  lat: 14.0683,
  lon: 121.3256,
};

const QUICK_CITIES: WeatherLocation[] = [
  DEFAULT_LOCATION,
  { name: 'Manila', country: 'Philippines', lat: 14.5995, lon: 120.9842 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
];

function describeWeatherCode(code: number): {
  label: string;
  kind: 'sun' | 'partly' | 'cloud' | 'rain' | 'storm';
} {
  if (code === 0) return { label: 'Clear Sky', kind: 'sun' };
  if (code >= 1 && code <= 2) return { label: 'Partly Cloudy', kind: 'partly' };
  if (code === 3 || code === 45 || code === 48)
    return { label: 'Overcast / Fog', kind: 'cloud' };
  if (code >= 51 && code <= 67) return { label: 'Rain / Drizzle', kind: 'rain' };
  if (code >= 71 && code <= 77) return { label: 'Snow / Frost', kind: 'cloud' };
  if (code >= 80 && code <= 82) return { label: 'Rain Showers', kind: 'rain' };
  if (code >= 95) return { label: 'Thunderstorm', kind: 'storm' };
  return { label: 'Variable Conditions', kind: 'partly' };
}

function WeatherGlyph({
  kind,
  className,
}: {
  kind: 'sun' | 'partly' | 'cloud' | 'rain' | 'storm';
  className?: string;
}) {
  if (kind === 'sun') return <Sun className={className} aria-hidden="true" />;
  if (kind === 'partly')
    return <CloudSun className={className} aria-hidden="true" />;
  if (kind === 'rain')
    return <CloudRain className={className} aria-hidden="true" />;
  if (kind === 'storm')
    return <CloudLightning className={className} aria-hidden="true" />;
  return <Cloud className={className} aria-hidden="true" />;
}

export const WeatherWidgetTool: React.FC = () => {
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [cityQuery, setCityQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherForecastData | null>(() =>
    readJson<WeatherForecastData | null>(
      STORAGE_KEYS.HEALTH_WEATHER_CACHE,
      null
    )
  );

  const fetchForecast = useCallback(async (loc: WeatherLocation) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather service unavailable');
      const data = await res.json();

      const next: WeatherForecastData = {
        locationName: loc.country ? `${loc.name}, ${loc.country}` : loc.name,
        lat: loc.lat,
        lon: loc.lon,
        fetchedAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        current: {
          tempC: data.current.temperature_2m,
          apparentC: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          windKmh: data.current.wind_speed_10m,
          weatherCode: data.current.weather_code,
        },
        daily: (data.daily.time as string[]).map((d, i) => ({
          date: d,
          code: data.daily.weather_code[i],
          maxC: data.daily.temperature_2m_max[i],
          minC: data.daily.temperature_2m_min[i],
        })),
      };

      setWeather(next);
      writeJson(STORAGE_KEYS.HEALTH_WEATHER_CACHE, next);
    } catch {
      setErrorMsg(
        'Could not reach Open-Meteo right now. Showing last cached forecast if available.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForecast(DEFAULT_LOCATION);
  }, [fetchForecast]);

  const handleSearchCity = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = cityQuery.trim();
    if (!q) return;
    setIsSearching(true);
    setErrorMsg(null);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          q
        )}&count=5&language=en&format=json`
      );
      if (!res.ok) throw new Error('City lookup failed');
      const data = await res.json();
      const hits: WeatherLocation[] = (data.results || []).map(
        (r: {
          name: string;
          country?: string;
          latitude: number;
          longitude: number;
        }) => ({
          name: r.name,
          country: r.country,
          lat: r.latitude,
          lon: r.longitude,
        })
      );
      setSearchResults(hits);
      if (hits.length === 0) {
        setErrorMsg(`No matching cities found for "${q}".`);
      }
    } catch {
      setErrorMsg('City search unavailable while offline.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported in this browser.');
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchForecast({
          name: 'My Current Location',
          lat: Number(pos.coords.latitude.toFixed(4)),
          lon: Number(pos.coords.longitude.toFixed(4)),
        });
      },
      () => {
        setIsLoading(false);
        setErrorMsg(
          'Location permission declined. Use city search or quick presets instead.'
        );
      },
      { timeout: 8000 }
    );
  };

  const formatTemp = (celsius: number) => {
    const val = unit === 'C' ? celsius : (celsius * 9) / 5 + 32;
    return `${Math.round(val)}°${unit}`;
  };

  const currentDesc = weather
    ? describeWeatherCode(weather.current.weatherCode)
    : null;

  return (
    <div className="space-y-5">
      {/* Search, Geolocation & Unit Controls */}
      <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-slate-900/80 p-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <form
            onSubmit={handleSearchCity}
            className="flex flex-1 flex-wrap items-center gap-2"
          >
            <div className="relative min-w-[200px] flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                placeholder="Search any city worldwide..."
                aria-label="Search city for weather"
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 pr-3.5 pl-10 text-sm text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="min-h-[44px] rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-300 disabled:opacity-50 whitespace-nowrap"
            >
              {isSearching ? 'Searching...' : 'Find City'}
            </button>

            <button
              type="button"
              onClick={handleUseGeolocation}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] whitespace-nowrap"
            >
              <Compass className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              <span>Use My Location</span>
            </button>
          </form>

          {/* °C / °F Toggle */}
          <div className="flex items-center gap-1 self-start rounded-xl border border-white/[0.08] bg-[#060913]/85 p-1 lg:self-center">
            {(['C', 'F'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`min-h-[38px] rounded-lg px-3.5 py-1 text-xs font-semibold transition-all ${
                  unit === u
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                °{u}
              </button>
            ))}
          </div>
        </div>

        {/* City Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-3">
            <span className="text-xs font-semibold text-slate-400">
              Select match:
            </span>
            {searchResults.map((hit, idx) => (
              <button
                key={`${hit.name}-${idx}`}
                type="button"
                onClick={() => {
                  setSearchResults([]);
                  setCityQuery('');
                  fetchForecast(hit);
                }}
                className="min-h-[36px] rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                {hit.name}
                {hit.country ? `, ${hit.country}` : ''}
              </button>
            ))}
          </div>
        )}

        {/* Quick City Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {QUICK_CITIES.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => fetchForecast(city)}
              className="min-h-[36px] shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300 transition-colors hover:border-cyan-400/35 hover:bg-cyan-400/10 hover:text-cyan-200 whitespace-nowrap"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div
          role="status"
          className="rounded-xl border border-cyan-400/35 bg-cyan-500/10 px-4 py-3 text-xs font-medium text-cyan-200 backdrop-blur-md"
        >
          {errorMsg}
        </div>
      )}

      {/* Current Weather & 5-Day Forecast */}
      {weather && currentDesc ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/75 p-6 text-slate-50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-cyan-500/15 blur-2xl"
            />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                  <span>{weather.locationName}</span>
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-500 tabular-nums">
                  {weather.lat.toFixed(4)}, {weather.lon.toFixed(4)} · Updated{' '}
                  {weather.fetchedAt}
                </p>
              </div>
              {isLoading && (
                <span className="text-xs text-cyan-300">Refreshing...</span>
              )}
            </div>

            <div className="relative mt-6 flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-cyan-400/10 motion-safe:animate-pulse"
                />
                <WeatherGlyph
                  kind={currentDesc.kind}
                  className="relative h-9 w-9 text-cyan-300"
                />
              </div>
              <div>
                <p className="font-mono text-5xl font-bold tracking-tight text-slate-50 tabular-nums">
                  {formatTemp(weather.current.tempC)}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-300">
                  {currentDesc.label} · Feels like{' '}
                  <span className="font-mono text-slate-100 tabular-nums">
                    {formatTemp(weather.current.apparentC)}
                  </span>
                </p>
              </div>
            </div>

            <div className="relative mt-6 grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-4 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Droplets className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span>
                  Humidity:{' '}
                  <strong className="font-mono text-slate-50 tabular-nums">
                    {weather.current.humidity}%
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Wind className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span>
                  Wind:{' '}
                  <strong className="font-mono text-slate-50 tabular-nums">
                    {weather.current.windKmh} km/h
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
              <h2 className="font-display text-base font-bold text-slate-50">
                5-Day Open-Meteo Forecast
              </h2>
              <span className="rounded-md border border-indigo-400/30 bg-indigo-500/15 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">
                Zero-API-Key Live Feed
              </span>
            </div>

            <div className="mt-3 divide-y divide-white/[0.06]">
              {weather.daily.map((day) => {
                const desc = describeWeatherCode(day.code);
                const dayName = new Date(`${day.date}T12:00:00`).toLocaleDateString(
                  'en-US',
                  { weekday: 'short', month: 'short', day: 'numeric' }
                );
                return (
                  <div
                    key={day.date}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <span className="w-28 text-xs font-semibold text-slate-100">
                      {dayName}
                    </span>
                    <div className="flex flex-1 items-center gap-2 text-xs text-slate-400">
                      <WeatherGlyph
                        kind={desc.kind}
                        className="h-4 w-4 shrink-0 text-cyan-300"
                      />
                      <span className="truncate">{desc.label}</span>
                    </div>
                    <div className="shrink-0 font-mono text-xs font-semibold text-slate-50 tabular-nums">
                      <span>{formatTemp(day.maxC)}</span>
                      <span className="mx-1.5 text-slate-600">/</span>
                      <span className="text-slate-400">
                        {formatTemp(day.minC)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/75 p-10 text-center text-sm text-slate-400 backdrop-blur-xl">
          {isLoading
            ? 'Loading live weather from Open-Meteo...'
            : 'Select a city or enable location to view weather.'}
        </div>
      )}
    </div>
  );
};
