// Weather — real live conditions via the FREE, no-key Open-Meteo APIs.
// Geocoding: https://geocoding-api.open-meteo.com/v1/search
// Forecast:  https://api.open-meteo.com/v1/forecast (up to 16 days daily)
// Every fetch is wrapped; a plausible deterministic fallback keeps the app
// fully working offline / rate-limited. `live: false` marks fallback data.

export interface GeoPoint {
  name: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2, lowercase
  lat: number;
  lng: number;
}

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  tMax: number; // °C
  tMin: number; // °C
  precipProb: number; // 0-100
  code: number; // WMO weather code
  summary: string;
  icon: string;
  estimated?: boolean; // true when beyond the 16-day horizon (climate-typical)
}

export interface Forecast {
  location: GeoPoint;
  days: DailyForecast[];
  live: boolean;
}

const WMO: [number[], string, string][] = [
  [[0], "Clear sky", "☀️"],
  [[1], "Mostly clear", "🌤️"],
  [[2], "Partly cloudy", "⛅"],
  [[3], "Overcast", "☁️"],
  [[45, 48], "Foggy", "🌫️"],
  [[51, 53, 55, 56, 57], "Drizzle", "🌦️"],
  [[61, 63, 65, 66, 67], "Rain", "🌧️"],
  [[71, 73, 75, 77, 85, 86], "Snow", "🌨️"],
  [[80, 81, 82], "Rain showers", "🌦️"],
  [[95, 96, 99], "Thunderstorm", "⛈️"],
];

export function describeWeatherCode(code: number): { summary: string; icon: string } {
  for (const [codes, summary, icon] of WMO) {
    if (codes.includes(code)) return { summary, icon };
  }
  return { summary: "Mixed conditions", icon: "🌥️" };
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Deterministic, plausible fallback so the UI never breaks offline. */
function fallbackGeo(place: string): GeoPoint {
  const h = hashStr(place.toLowerCase());
  return {
    name: place,
    country: "—",
    countryCode: "xx",
    lat: ((h % 12000) / 100) - 60, // -60..60
    lng: ((h % 34000) / 100) - 170,
  };
}

function fallbackDay(place: string, date: string, estimated = false): DailyForecast {
  const h = hashStr(place.toLowerCase() + date);
  const base = 14 + (hashStr(place.toLowerCase()) % 14); // stable per-place 14..27°C
  const swing = (h % 60) / 10 - 3; // -3..+3
  const tMax = Math.round(base + swing + 5);
  const tMin = Math.round(base + swing - 3);
  const precipProb = h % 70;
  const code = precipProb > 50 ? 61 : precipProb > 30 ? 2 : 0;
  const { summary, icon } = describeWeatherCode(code);
  return { date, tMax, tMin, precipProb, code, summary, icon, estimated };
}

export async function geocode(place: string): Promise<{ point: GeoPoint; live: boolean }> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`geocode ${res.status}`);
    const json = await res.json();
    const r = json?.results?.[0];
    if (!r) throw new Error("no geocode result");
    return {
      point: {
        name: r.name,
        country: r.country ?? "—",
        countryCode: (r.country_code ?? "xx").toLowerCase(),
        lat: r.latitude,
        lng: r.longitude,
      },
      live: true,
    };
  } catch {
    return { point: fallbackGeo(place), live: false };
  }
}

/** Real 16-day daily forecast for a named place; graceful fallback if offline. */
export async function getForecast(place: string, days = 16): Promise<Forecast> {
  const { point, live: geoLive } = await geocode(place);
  const n = Math.min(Math.max(days, 1), 16);
  try {
    if (!geoLive) throw new Error("geocode fell back");
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${point.lat}&longitude=${point.lng}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean,weather_code` +
      `&forecast_days=${n}&timezone=auto`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`forecast ${res.status}`);
    const json = await res.json();
    const d = json.daily;
    const out: DailyForecast[] = (d.time as string[]).map((date: string, i: number) => {
      const code = d.weather_code?.[i] ?? 0;
      const { summary, icon } = describeWeatherCode(code);
      return {
        date,
        tMax: Math.round(d.temperature_2m_max?.[i] ?? 20),
        tMin: Math.round(d.temperature_2m_min?.[i] ?? 12),
        precipProb: Math.round(d.precipitation_probability_mean?.[i] ?? 0),
        code,
        summary,
        icon,
      };
    });
    if (!out.length) throw new Error("empty forecast");
    return { location: point, days: out, live: true };
  } catch {
    const today = new Date();
    const daysOut: DailyForecast[] = [];
    for (let i = 0; i < n; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      daysOut.push(fallbackDay(place, isoDate(d)));
    }
    return { location: point, days: daysOut, live: false };
  }
}

/** Today's conditions at a place. */
export async function getTodayWeather(place: string): Promise<{ location: GeoPoint; today: DailyForecast; live: boolean }> {
  const f = await getForecast(place, 1);
  return { location: f.location, today: f.days[0], live: f.live };
}

/**
 * Forecast covering an arbitrary trip window. Days within the 16-day live
 * horizon come from the real forecast; later days are climate-typical
 * estimates (marked `estimated: true`) derived from the live tail.
 */
export async function forecastForDates(
  place: string,
  start: string,
  end: string
): Promise<Forecast> {
  const f = await getForecast(place, 16);
  const startD = new Date(start + "T00:00:00Z");
  const endD = new Date(end + "T00:00:00Z");
  if (isNaN(startD.getTime()) || isNaN(endD.getTime()) || endD < startD) {
    return f;
  }
  const byDate = new Map(f.days.map((d) => [d.date, d]));
  const tail = f.days.slice(-5);
  const avg = (sel: (d: DailyForecast) => number) =>
    Math.round(tail.reduce((a, d) => a + sel(d), 0) / Math.max(tail.length, 1));
  const days: DailyForecast[] = [];
  for (let d = new Date(startD); d <= endD && days.length < 45; d.setUTCDate(d.getUTCDate() + 1)) {
    const key = isoDate(d);
    const hit = byDate.get(key);
    if (hit) {
      days.push(hit);
    } else {
      // climate-typical estimate seeded by live tail + place
      const jitter = (hashStr(place + key) % 5) - 2;
      const code = avg((x) => x.precipProb) + jitter * 5 > 45 ? 61 : 2;
      const { summary, icon } = describeWeatherCode(code);
      days.push({
        date: key,
        tMax: avg((x) => x.tMax) + jitter,
        tMin: avg((x) => x.tMin) + jitter,
        precipProb: Math.min(95, Math.max(5, avg((x) => x.precipProb) + jitter * 4)),
        code,
        summary: `${summary} (typical)`,
        icon,
        estimated: true,
      });
    }
  }
  return { location: f.location, days: days.length ? days : f.days, live: f.live };
}
