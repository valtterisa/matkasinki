import type { LocalRoutePlan, RouteLeg, RouteStop } from "./types";
import { CHAT_SUGGESTIONS } from "./chat-suggestions";

export { CHAT_SUGGESTIONS } from "./chat-suggestions";

export interface ChatSuggestion {
  id: string;
  prompt: string;
}

interface SamplePlan {
  id: string;
  title: string;
  summary: string;
  origin: { lat: number; lon: number };
  stops: RouteStop[];
  legs: RouteLeg[];
  reply: string;
  keywords: string[];
}

function leg(
  mode: string,
  fromName: string,
  toName: string,
  instruction: string,
  durationSeconds: number,
  polyline: [number, number][],
  extra?: Partial<RouteLeg>,
): RouteLeg {
  return {
    mode,
    durationSeconds,
    fromName,
    toName,
    instruction,
    polyline,
    ...extra,
  };
}

const SAMPLE_PLANS: SamplePlan[] = [
  {
    id: "keskusta-classics",
    title: "Keskusta classics",
    summary: "Senate Square → Market Hall → Oodi → Savoy",
    keywords: ["keskusta", "cathedral", "market", "senate", "oodi", "classic", "square"],
    origin: { lat: 60.1699, lon: 24.9384 },
    stops: [
      { order: 1, name: "Senate Square", lat: 60.1695, lon: 24.9524, category: "sight", dwellMinutes: 0 },
      { order: 2, name: "Helsinki Market Hall", lat: 60.1672, lon: 24.9536, category: "sight", dwellMinutes: 45 },
      { order: 3, name: "Oodi Central Library", lat: 60.1739, lon: 24.9375, category: "sight", dwellMinutes: 40 },
      { order: 4, name: "Restaurant Savoy", lat: 60.1678, lon: 24.9472, category: "restaurant", dwellMinutes: 120 },
    ],
    legs: [
      leg("WALK", "Kamppi", "Senate Square", "Walk 12 min from Kamppi up to Senate Square", 720, [
        [24.9384, 60.1699],
        [24.944, 60.1688],
        [24.9524, 60.1695],
      ], { distanceMeters: 900 }),
      leg("WALK", "Senate Square", "Market Hall", "Walk 4 min downhill to the Market Hall", 240, [
        [24.9524, 60.1695],
        [24.9536, 60.1672],
      ], { distanceMeters: 280 }),
      leg("TRAM", "Market Square", "Oodi", "Tram 2 toward Oodi (8 min)", 480, [
        [24.9536, 60.1672],
        [24.946, 60.171],
        [24.9375, 60.1739],
      ], { line: "2", headsign: "Oodi" }),
      leg("WALK", "Oodi", "Savoy", "Walk 10 min through the park to Savoy", 600, [
        [24.9375, 60.1739],
        [24.942, 60.1705],
        [24.9472, 60.1678],
      ], { distanceMeters: 750 }),
    ],
    reply: `Right — classic Keskusta, no wasted kilometres.

10:00 — Senate Square & cathedral steps (free, good light before lunch crowds).
11:00 — Market Hall for coffee and a snack — stay inside if it drizzles.
12:30 — Oodi: rooftop views, design shop, quick sit-down.
18:30 — Savoy for dinner — book ahead on weekends.

Getting around: short walks plus Tram 2 from the market to Oodi. AB ticket covers the lot (€3.20, 80 min).

Tip: Do Market Hall before 14:00 — stalls thin out later.`,
  },
  {
    id: "museum-punavuori",
    title: "Museums & Punavuori evening",
    summary: "Ateneum → Design Museum → Punavuori dinner",
    keywords: ["museum", "museums", "ateneum", "design", "punavuori", "art", "helsinki trip"],
    origin: { lat: 60.1699, lon: 24.9384 },
    stops: [
      { order: 1, name: "Ateneum Art Museum", lat: 60.1698, lon: 24.9435, category: "museum", dwellMinutes: 0 },
      { order: 2, name: "Design Museum", lat: 60.1633, lon: 24.9472, category: "museum", dwellMinutes: 75 },
      { order: 3, name: "Café Regatta", lat: 60.1789, lon: 24.9142, category: "cafe", dwellMinutes: 45 },
      { order: 4, name: "Restaurant Nolla", lat: 60.1631, lon: 24.9364, category: "restaurant", dwellMinutes: 120 },
    ],
    legs: [
      leg("TRAM", "Kamppi", "Ateneum", "Tram 3 to Ateneum (6 min)", 360, [
        [24.9384, 60.1699],
        [24.941, 60.1695],
        [24.9435, 60.1698],
      ], { line: "3", headsign: "Eira" }),
      leg("WALK", "Ateneum", "Design Museum", "Walk 12 min along the boulevard", 720, [
        [24.9435, 60.1698],
        [24.945, 60.166],
        [24.9472, 60.1633],
      ], { distanceMeters: 950 }),
      leg("TRAM", "Design Museum", "Hernesaari", "Tram 6 toward Hernesaari (14 min)", 840, [
        [24.9472, 60.1633],
        [24.93, 60.17],
        [24.9142, 60.1789],
      ], { line: "6", headsign: "Hernesaari" }),
      leg("TRAM", "Café Regatta", "Punavuori", "Tram 6 back to Punavuori (12 min)", 720, [
        [24.9142, 60.1789],
        [24.925, 60.168],
        [24.9364, 60.1631],
      ], { line: "6", headsign: "Kamppi" }),
    ],
    reply: `Museum day with a soft landing in Punavuori — sensible order.

10:30 — Ateneum while you're fresh (90 min is enough for the highlights).
12:15 — Design Museum — shorter visit, good café inside.
15:00 — Café Regatta by the water; cinnamon bun mandatory.
19:00 — Nolla for a low-key dinner in Punavuori.

Transit: Tram 3 in, then Tram 6 for the seaside leg. Two-zone AB ticket.

Tip: Ateneum tickets are cheaper online — skip the queue at the door.`,
  },
  {
    id: "rock-kaivopuisto",
    title: "Rock Church & Kaivopuisto",
    summary: "Temppeliaukio → Eira → Kaivopuisto lunch",
    keywords: ["temppeliaukio", "rock", "church", "kaivopuisto", "sea", "seaside", "helsinki day"],
    origin: { lat: 60.1699, lon: 24.9384 },
    stops: [
      { order: 1, name: "Temppeliaukio Church", lat: 60.173, lon: 24.9254, category: "sight", dwellMinutes: 0 },
      { order: 2, name: "Eira neighbourhood", lat: 60.1642, lon: 24.9312, category: "sight", dwellMinutes: 30 },
      { order: 3, name: "Kaivopuisto Park", lat: 60.1568, lon: 24.9532, category: "sight", dwellMinutes: 60 },
      { order: 4, name: "Café Ursula", lat: 60.1551, lon: 24.9561, category: "restaurant", dwellMinutes: 90 },
    ],
    legs: [
      leg("TRAM", "Kamppi", "Temppeliaukio", "Tram 2 to the Rock Church (10 min)", 600, [
        [24.9384, 60.1699],
        [24.932, 60.171],
        [24.9254, 60.173],
      ], { line: "2", headsign: "Olympiaterminaali" }),
      leg("TRAM", "Temppeliaukio", "Eira", "Tram 2 toward Eira (8 min)", 480, [
        [24.9254, 60.173],
        [24.928, 60.168],
        [24.9312, 60.1642],
      ], { line: "2", headsign: "Eira" }),
      leg("TRAM", "Eira", "Kaivopuisto", "Tram 3 along the shore (12 min)", 720, [
        [24.9312, 60.1642],
        [24.942, 60.16],
        [24.9532, 60.1568],
      ], { line: "3", headsign: "Kaivopuisto" }),
      leg("WALK", "Kaivopuisto", "Café Ursula", "Walk 3 min along the harbour", 180, [
        [24.9532, 60.1568],
        [24.9561, 60.1551],
      ], { distanceMeters: 200 }),
    ],
    reply: `South Helsinki loop — quiet morning, sea air after lunch.

09:30 — Temppeliaukio (arrive early; it's small and fills fast).
11:00 — Stroll Eira's art-nouveau streets — no rush.
12:30 — Kaivopuisto for the view and a bench lunch if weather's fine.
14:00 — Café Ursula if you want a proper sit-down by the water.

Transit: Tram 2 and 3 — all above ground, easy to follow.

Tip: Rock Church has a short admission fee; card only at the kiosk.`,
  },
  {
    id: "hakaniemi-food",
    title: "Hakaniemi food crawl",
    summary: "Kamppi → Hakaniemi Market → Kallio",
    keywords: ["hakaniemi", "market", "food", "kallio", "lunch", "food day"],
    origin: { lat: 60.1699, lon: 24.9384 },
    stops: [
      { order: 1, name: "Kamppi", lat: 60.1699, lon: 24.9384, category: "sight", dwellMinutes: 0 },
      { order: 2, name: "Hakaniemi Market Hall", lat: 60.1863, lon: 24.9498, category: "restaurant", dwellMinutes: 75 },
      { order: 3, name: "Kallio Church Park", lat: 60.1847, lon: 24.9592, category: "sight", dwellMinutes: 30 },
      { order: 4, name: "Siltanen", lat: 60.1865, lon: 24.9618, category: "bar", dwellMinutes: 90 },
    ],
    legs: [
      leg("SUBWAY", "Kamppi", "Hakaniemi", "Metro M1 to Hakaniemi (4 min)", 240, [
        [24.9384, 60.1699],
        [24.944, 60.178],
        [24.9498, 60.1863],
      ], { line: "M1", headsign: "Vuosaari" }),
      leg("WALK", "Hakaniemi", "Market Hall", "Walk 2 min to the market hall entrance", 120, [
        [24.9498, 60.1863],
        [24.9498, 60.1863],
      ], { distanceMeters: 120 }),
      leg("WALK", "Market Hall", "Kallio Church", "Walk 8 min uphill to Kallio", 480, [
        [24.9498, 60.1863],
        [24.955, 60.185],
        [24.9592, 60.1847],
      ], { distanceMeters: 550 }),
      leg("WALK", "Kallio Church", "Siltanen", "Walk 4 min to Siltanen", 240, [
        [24.9592, 60.1847],
        [24.9618, 60.1865],
      ], { distanceMeters: 300 }),
    ],
    reply: `Short hop north — eat first, wander after.

11:30 — Hakaniemi Market Hall: salmon soup, pastries, coffee. This is the main event.
13:30 — Walk off lunch around Kallio Church park.
16:00 — Siltanen for a beer — terrace if the sun's out.

Transit: Metro M1 Kamppi → Hakaniemi, then walking. AB ticket.

Tip: Market Hall gets loud at noon — go 11:00–11:30 for a table.`,
  },
  {
    id: "suomenlinna",
    title: "Suomenlinna island day",
    summary: "Kauppatori ferry → fortress → return",
    keywords: ["suomenlinna", "ferry", "island", "fortress", "kauppatori", "ferry day"],
    origin: { lat: 60.1674, lon: 24.9524 },
    stops: [
      { order: 1, name: "Market Square ferry", lat: 60.1674, lon: 24.9524, category: "sight", dwellMinutes: 0 },
      { order: 2, name: "Suomenlinna main quay", lat: 60.1458, lon: 24.9872, category: "historic", dwellMinutes: 30 },
      { order: 3, name: "King's Gate", lat: 60.1435, lon: 24.9851, category: "historic", dwellMinutes: 45 },
      { order: 4, name: "Bastion Zander", lat: 60.1472, lon: 24.9912, category: "sight", dwellMinutes: 60 },
      { order: 5, name: "Market Square", lat: 60.1674, lon: 24.9524, category: "sight", dwellMinutes: 0 },
    ],
    legs: [
      leg("FERRY", "Kauppatori", "Suomenlinna", "HSL ferry to Suomenlinna (15 min)", 900, [
        [24.9524, 60.1674],
        [24.968, 60.156],
        [24.9872, 60.1458],
      ], { line: "Ferry", headsign: "Suomenlinna" }),
      leg("WALK", "Main quay", "King's Gate", "Walk 15 min along the coastal path", 900, [
        [24.9872, 60.1458],
        [24.986, 60.1445],
        [24.9851, 60.1435],
      ], { distanceMeters: 1100 }),
      leg("WALK", "King's Gate", "Bastion Zander", "Walk 12 min across the island", 720, [
        [24.9851, 60.1435],
        [24.988, 60.145],
        [24.9912, 60.1472],
      ], { distanceMeters: 850 }),
      leg("FERRY", "Suomenlinna", "Kauppatori", "Return ferry to the city (15 min)", 900, [
        [24.9912, 60.1472],
        [24.97, 60.158],
        [24.9524, 60.1674],
      ], { line: "Ferry", headsign: "Kauppatori" }),
    ],
    reply: `Proper island day — ferry there, shoes for cobbles.

10:00 — Ferry from Kauppatori (runs every 20–30 min; sit on the top deck if it's clear).
10:45 — Main quay → King's Gate along the blue route markers.
12:00 — Picnic or café on the island (pack snacks — options are limited).
15:00 — Bastion Zander for the wide harbour view.
16:30 — Ferry back before dinner in town.

Tickets: HSL AB covers the ferry in season — check the HSL app for winter schedules.

Tip: Most of Suomenlinna is free; only the museum costs extra. Wind off the sea — bring a layer.`,
  },
];

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function scorePlan(sample: SamplePlan, prompt: string): number {
  const p = normalize(prompt);
  const suggestion = CHAT_SUGGESTIONS.find((s) => s.id === sample.id);
  if (suggestion && normalize(suggestion.prompt) === p) return 1000;

  let score = 0;
  for (const kw of sample.keywords) {
    if (p.includes(kw)) score += 10;
  }
  if (p.includes("plan a") && p.includes("helsinki") && sample.id === "museum-punavuori" && p.includes("museum")) {
    score = Math.max(score, 50);
  }
  return score;
}

export function getSamplePlanForPrompt(prompt: string): { plan: LocalRoutePlan; reply: string } {
  const trimmed = prompt.trim() || CHAT_SUGGESTIONS[0].prompt;
  const best =
    SAMPLE_PLANS.slice()
      .sort((a, b) => scorePlan(b, trimmed) - scorePlan(a, trimmed))
      .find((s) => scorePlan(s, trimmed) > 0) ?? SAMPLE_PLANS[0];

  const now = new Date().toISOString();
  const plan: LocalRoutePlan = {
    id: `sample-${best.id}`,
    prompt: trimmed,
    title: best.title,
    summary: best.summary,
    origin: best.origin,
    stops: best.stops,
    legs: best.legs,
    savedAt: now,
  };

  return { plan, reply: best.reply };
}

export function demoHelsinkiRoute(prompt?: string): LocalRoutePlan {
  return getSamplePlanForPrompt(prompt ?? CHAT_SUGGESTIONS[0].prompt).plan;
}
