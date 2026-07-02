// Packing List — real dynamic generator. Pulls the REAL forecast (Open-Meteo)
// for the trip's actual dates/location (up to 16 days live; climate-typical
// beyond) and sizes the list to actual temps/rain. Every weather-driven item
// says WHY. Regenerating with the latest forecast = the daily-update loop.

import { forecastForDates, type Forecast } from "@/lib/weather";

export type PackCategory = "documents" | "clothing" | "tech" | "health" | "extras";

export interface PackItem {
  id: string;
  name: string;
  category: PackCategory;
  qty?: number;
  reason?: string; // WHY this made the list
}

export interface WeatherDigest {
  nights: number;
  tMin: number;
  tMax: number;
  rainDays: number;
  hotDays: number;
  coldDays: number;
  estimatedDays: number;
  live: boolean;
}

export interface PackingList {
  destination: string;
  dates: { start: string; end: string };
  generatedAt: string;
  digest: WeatherDigest;
  forecast: Forecast;
  items: PackItem[];
}

export async function generatePackingList(args: {
  destination: string;
  dates: { start: string; end: string };
  tripType?: string;
}): Promise<PackingList> {
  const { destination, dates } = args;
  let idc = 0;
  const item = (name: string, category: PackCategory, reason?: string, qty?: number): PackItem => ({
    id: `pk-${category}-${idc++}`,
    name,
    category,
    qty,
    reason,
  });

  const forecast = await forecastForDates(destination, dates.start, dates.end);
  const days = forecast.days;

  const nights = Math.max(1, days.length - 1);
  const tMin = Math.min(...days.map((d) => d.tMin));
  const tMax = Math.max(...days.map((d) => d.tMax));
  const rainDays = days.filter((d) => d.precipProb >= 50).length;
  const hotDays = days.filter((d) => d.tMax >= 28).length;
  const coldDays = days.filter((d) => d.tMin < 10).length;
  const estimatedDays = days.filter((d) => d.estimated).length;
  const digest: WeatherDigest = { nights, tMin, tMax, rainDays, hotDays, coldDays, estimatedDays, live: forecast.live };

  const items: PackItem[] = [];

  // Documents — always
  items.push(
    item("Passport (6+ months validity)", "documents"),
    item("Travel insurance details (offline copy)", "documents"),
    item("Booking confirmations — flights & stays", "documents"),
    item("Payment cards + small emergency cash", "documents", "Card outages happen; markets are often cash-only"),
    item("Photo of passport in cloud + phone", "documents", "Fast replacement if the original goes missing")
  );

  // Clothing — sized to the ACTUAL forecast
  const tees = Math.min(10, Math.max(3, Math.ceil(nights * 0.8)));
  items.push(item("T-shirts / tops", "clothing", `${nights} nights → roughly one per day with light re-wear`, tees));
  items.push(item("Underwear & socks (sets)", "clothing", `${nights} nights + 1 spare set`, Math.min(12, nights + 1)));
  if (hotDays > 0) {
    items.push(
      item(
        "Shorts / light trousers",
        "clothing",
        `${hotDays} day(s) at 28°C+ — heat confirmed in the forecast`,
        Math.min(4, Math.max(2, Math.ceil(hotDays / 2)))
      ),
      item("Sun hat & sunglasses", "clothing", `Highs up to ${tMax}°C`),
      item("Swimwear", "clothing", "Hot days — pools, beaches or bathhouses likely on the menu")
    );
  }
  if (coldDays > 0) {
    items.push(
      item("Warm layer (fleece / midlayer)", "clothing", `${coldDays} day(s) below 10°C (min ${tMin}°C)`),
      item("Light insulated jacket", "clothing", `Evening lows around ${tMin}°C`)
    );
  } else if (tMin < 17) {
    items.push(item("Light sweater / long-sleeve layer", "clothing", `Evenings around ${tMin}°C — cool after sunset`));
  }
  if (rainDays > 0) {
    items.push(
      item("Packable rain shell", "clothing", `${rainDays} rain day(s) forecast (≥50% probability) → packable rain shell`),
      item("Quick-dry footwear or spare shoes", "clothing", `${rainDays} wet day(s) — soaked shoes ruin the next morning`)
    );
  }
  items.push(item("Comfortable walking shoes (broken in)", "clothing", "Every plan in this app involves walking"));
  items.push(item("One smart-casual outfit", "clothing", "For the nice dinner / performance evening"));

  // Tech
  items.push(
    item("Phone + charger", "tech"),
    item("Universal travel adapter", "tech", `Sockets in ${forecast.location.country} may differ from home`),
    item("Power bank", "tech", "Navigation + photos + translation drain a battery by mid-afternoon"),
    item("Offline maps downloaded", "tech", "Data is patchy exactly when you're most lost")
  );
  if (rainDays >= 2) items.push(item("Zip-lock / dry bag for electronics", "tech", `${rainDays} rain days — cheap insurance for the phone`));

  // Health
  items.push(
    item("Personal medications + prescription copies", "health"),
    item("Basic first-aid: plasters, painkillers, rehydration salts", "health"),
    item("Hand sanitiser", "health")
  );
  if (hotDays > 0) items.push(item("Sunscreen SPF 50", "health", `${hotDays} hot day(s), highs to ${tMax}°C`));
  if (hotDays >= 3) items.push(item("Insect repellent", "health", "Warm evenings = mosquitoes in most destinations"));

  // Extras
  items.push(
    item("Reusable water bottle", "extras", "Cheaper, greener; most airports have refill stations"),
    item("Packable day bag", "extras", "For day plans and market hauls"),
    item("Earplugs + eye mask", "extras", "City-centre stays are loud; flights are bright")
  );
  if (nights > 5) items.push(item("Laundry bag / soap sheet", "extras", `${nights} nights — a sink wash halves what you pack`));
  if (rainDays > 0) items.push(item("Compact umbrella", "extras", `${rainDays} rain day(s) in the window`));

  return {
    destination,
    dates,
    generatedAt: new Date().toISOString(),
    digest,
    forecast,
    items,
  };
}
