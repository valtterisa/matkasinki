// Currency — real conversion rates via the FREE, no-key open.er-api.com API,
// with a built-in static fallback (~20+ major currencies) so conversion always
// works offline. Rates are cached in-process for an hour.

export interface Rates {
  base: "USD";
  rates: Record<string, number>;
  live: boolean;
  fetchedAt: string;
}

// Approximate mid-2026 rates vs USD — fallback only; live rates preferred.
const STATIC_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 152,
  VND: 25400,
  KRW: 1360,
  CNY: 7.2,
  TWD: 32.2,
  THB: 35.8,
  MXN: 18.4,
  ZAR: 18.1,
  CHF: 0.88,
  CAD: 1.36,
  AUD: 1.5,
  NZD: 1.63,
  SEK: 10.4,
  NOK: 10.6,
  DKK: 6.87,
  SGD: 1.34,
  INR: 84.2,
  BRL: 5.4,
  PLN: 3.95,
  CZK: 22.9,
  HUF: 358,
  PHP: 57.5,
};

export const CURRENCIES = Object.keys(STATIC_RATES);

let cache: Rates | null = null;
let cacheTime = 0;
const TTL_MS = 60 * 60 * 1000;

export async function getRates(): Promise<Rates> {
  if (cache && Date.now() - cacheTime < TTL_MS) return cache;
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`rates ${res.status}`);
    const json = await res.json();
    if (json?.result !== "success" || !json?.rates?.EUR) throw new Error("bad rates payload");
    cache = {
      base: "USD",
      rates: { ...STATIC_RATES, ...json.rates },
      live: true,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    cache = {
      base: "USD",
      rates: { ...STATIC_RATES },
      live: false,
      fetchedAt: new Date().toISOString(),
    };
  }
  cacheTime = Date.now();
  return cache;
}

/** Convert between any two known currencies via the USD base. Unknown codes pass through 1:1. */
export function convert(amount: number, from: string, to: string, rates: Rates): number {
  const f = rates.rates[from.toUpperCase()] ?? 1;
  const t = rates.rates[to.toUpperCase()] ?? 1;
  if (!isFinite(f) || !isFinite(t) || f === 0) return amount;
  return (amount / f) * t;
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: amount >= 1000 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}
