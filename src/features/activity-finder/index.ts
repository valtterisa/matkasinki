// Activity Finder — real weather + location + mood -> a coherent day plan.
// Difficulty scales intensity and spawns MORE itinerary-consistent challenges.
// Claude generates when ANTHROPIC_API_KEY is set; otherwise a quality
// weather-aware template engine — never crashes, never empty.

import { getTodayWeather, type DailyForecast, type GeoPoint } from "@/lib/weather";
import { anthropic, MODELS } from "@/agents/shared/llm";

export type Difficulty = "chill" | "standard" | "adventurous" | "hardcore";
export type Mood = "curious" | "foodie" | "culture" | "relax" | "adventure" | "social";

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  indoor: boolean;
  intensity: 1 | 2 | 3; // 1 easy stroll .. 3 full send
}

export interface DayChallenge {
  id: string;
  title: string;
  description: string;
}

export interface DayPlan {
  location: GeoPoint;
  weather: DailyForecast;
  weatherLive: boolean;
  mood: Mood;
  difficulty: Difficulty;
  headline: string;
  activities: Activity[];
  challenges: DayChallenge[];
  source: "claude" | "template";
}

const DIFF_SCALE: Record<Difficulty, { acts: number; chals: number; minIntensity: number }> = {
  chill: { acts: 3, chals: 1, minIntensity: 1 },
  standard: { acts: 4, chals: 2, minIntensity: 1 },
  adventurous: { acts: 5, chals: 3, minIntensity: 2 },
  hardcore: { acts: 6, chals: 5, minIntensity: 2 },
};

const SLOTS = ["09:00", "11:30", "13:30", "15:30", "18:00", "20:30"];

type PoolItem = { title: string; description: string; indoor: boolean; intensity: 1 | 2 | 3 };

const POOLS: Record<Mood, PoolItem[]> = {
  curious: [
    { title: "Old-town wander with no map", description: "Pick the narrowest street in {city} and follow it — the best finds are two turns off the main drag.", indoor: false, intensity: 1 },
    { title: "Local market recon", description: "Browse the central market in {city}; note three ingredients you can't name, then ask a vendor about one.", indoor: true, intensity: 1 },
    { title: "Neighbourhood beyond the guidebook", description: "Take public transport four stops out of the centre and walk back — the real {city} lives here.", indoor: false, intensity: 2 },
    { title: "Independent bookshop + café stop", description: "Find a local bookshop, buy something small, and read the first chapter over a local coffee.", indoor: true, intensity: 1 },
    { title: "Viewpoint hunt", description: "Find the highest legally reachable point in {city} on foot and earn the panorama.", indoor: false, intensity: 3 },
    { title: "Free walking-tour crash course", description: "Join (and tip) a free walking tour for the fastest orientation a first-timer can get.", indoor: false, intensity: 2 },
  ],
  foodie: [
    { title: "Breakfast where the workers eat", description: "Skip the hotel buffet — find the counter spot in {city} with a queue of locals before 9am.", indoor: true, intensity: 1 },
    { title: "Market grazing lunch", description: "Assemble lunch from three different market stalls; nothing that appears on a laminated menu.", indoor: true, intensity: 1 },
    { title: "The one-dish pilgrimage", description: "Identify the dish {city} is proudest of and go to the place locals argue does it best.", indoor: true, intensity: 2 },
    { title: "Street-food crawl", description: "Three stands, three snacks, one rule: order whatever the person before you ordered.", indoor: false, intensity: 2 },
    { title: "Cooking-class or tasting session", description: "Book a same-day class or tasting — you leave {city} able to recreate one dish.", indoor: true, intensity: 2 },
    { title: "Dessert finale", description: "End on the local sweet: find the historic pastry or dessert house every grandmother endorses.", indoor: true, intensity: 1 },
  ],
  culture: [
    { title: "The museum locals actually rate", description: "Skip the biggest queue; pick the smaller museum in {city} with the strongest local reputation.", indoor: true, intensity: 1 },
    { title: "Architecture walk", description: "Trace one architectural era across {city} — note three buildings and what they replaced.", indoor: false, intensity: 2 },
    { title: "Sacred spaces hour", description: "Visit the main temple/cathedral/mosque quietly at an off-peak hour; sit for ten minutes.", indoor: true, intensity: 1 },
    { title: "Gallery + artist studio district", description: "Find the neighbourhood where working artists show — buy a print, not a fridge magnet.", indoor: true, intensity: 1 },
    { title: "Evening performance", description: "Whatever is on tonight in {city} — music, theatre, fado, puppetry — take the cheap seat.", indoor: true, intensity: 2 },
    { title: "History on foot", description: "Follow one historical event through {city} across three sites — the story beats any plaque.", indoor: false, intensity: 2 },
  ],
  relax: [
    { title: "Slow park morning", description: "Best green space in {city}, a bench, a pastry, zero agenda for 90 minutes.", indoor: false, intensity: 1 },
    { title: "Thermal bath / spa reset", description: "Find the local bathhouse or spa tradition and commit an afternoon to it.", indoor: true, intensity: 1 },
    { title: "Waterfront amble", description: "Walk the river/sea front of {city} at golden hour at exactly half your normal pace.", indoor: false, intensity: 1 },
    { title: "Long lunch, no phone", description: "Two courses minimum, table outside if the weather holds, phone in the bag.", indoor: true, intensity: 1 },
    { title: "Scenic transit loop", description: "Ride the prettiest tram/ferry/funicular line in {city} end to end just for the view.", indoor: true, intensity: 1 },
    { title: "Sunset spot with snacks", description: "Buy local snacks, find west-facing steps, applaud the sunset like a local.", indoor: false, intensity: 1 },
  ],
  adventure: [
    { title: "Sunrise summit or coastal path", description: "The classic hard walk near {city} — start early, pack water, earn breakfast.", indoor: false, intensity: 3 },
    { title: "Rent wheels", description: "Bike or kayak — cover the distance the walking tourists never see.", indoor: false, intensity: 3 },
    { title: "Urban stair challenge", description: "Find the steepest public staircase in {city} and do it twice. Yes, twice.", indoor: false, intensity: 3 },
    { title: "Open-water or pool plunge", description: "Where locals swim — sea, river pool, or lido. Cold counts double.", indoor: false, intensity: 2 },
    { title: "Climbing / bouldering session", description: "Every city has a climbing gym full of friendly locals with route advice.", indoor: true, intensity: 3 },
    { title: "Night hike or city run", description: "5k through {city} after dark on the safe, lit route locals use.", indoor: false, intensity: 3 },
  ],
  social: [
    { title: "Language-exchange or pub-quiz night", description: "Find tonight's meetup in {city} — travellers and locals, zero awkwardness after 20 minutes.", indoor: true, intensity: 1 },
    { title: "Counter-seat lunch", description: "Eat at the bar/counter and ask the person next to you what to do tomorrow.", indoor: true, intensity: 1 },
    { title: "Local sports match", description: "Whatever {city} plays — football, baseball, jai alai — buy the cheap ticket and cheer with the home end.", indoor: false, intensity: 2 },
    { title: "Board-game café or arcade", description: "Order once, stay two hours, challenge strangers to whatever they're playing.", indoor: true, intensity: 1 },
    { title: "Guided group activity", description: "Book a small-group tour or class — instant temporary friends with shared snacks.", indoor: true, intensity: 2 },
    { title: "Neighbourhood bar crawl (quality over quantity)", description: "Three venues max in one district of {city}; talk to one bartender per stop.", indoor: true, intensity: 2 },
  ],
};

const CHALLENGE_SEEDS = [
  { title: "Order in the local language", description: "During “{act}”, order or ask a question entirely in the local language. Miming allowed, English isn't." },
  { title: "Find the hidden detail", description: "At “{act}”, find one detail no guidebook mentions — photograph it and note why it caught you." },
  { title: "Spend under budget", description: "Complete “{act}” spending less than you expected — log the receipt in the Budget Tracker to prove it." },
  { title: "Local recommendation relay", description: "During “{act}”, get a local to recommend the next stop — and actually go." },
  { title: "No-phone hour", description: "Do “{act}” with your phone away except for one single photo at the end." },
  { title: "Golden-hour bonus", description: "Time “{act}” to catch golden hour — proof is in the photo light." },
  { title: "Walk it, don't ride it", description: "Get to “{act}” entirely on foot or by public transport — no taxis, no apps." },
];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}

function templatePlan(args: {
  location: GeoPoint;
  weather: DailyForecast;
  weatherLive: boolean;
  mood: Mood;
  difficulty: Difficulty;
  date: string;
}): DayPlan {
  const { location, weather, mood, difficulty, date } = args;
  const scale = DIFF_SCALE[difficulty];
  const rainy = weather.precipProb >= 55;
  const seed = hashStr(location.name + date + mood + difficulty);

  let pool = seededShuffle(POOLS[mood], seed);
  // Weather-aware: on rainy days front-load indoor options; keep intensity floor.
  pool = [...pool].sort((a, b) => {
    const wet = (x: PoolItem) => (rainy && !x.indoor ? 1 : 0);
    const soft = (x: PoolItem) => (x.intensity < scale.minIntensity ? 1 : 0);
    return wet(a) + soft(a) - (wet(b) + soft(b));
  });

  const activities: Activity[] = pool.slice(0, scale.acts).map((p, i) => ({
    id: `act-${date}-${i}`,
    time: SLOTS[i] ?? "21:00",
    title: p.title,
    description:
      p.description.replaceAll("{city}", location.name) +
      (rainy && !p.indoor ? " (Rain likely — pack a shell or swap order with an indoor stop.)" : ""),
    indoor: p.indoor,
    intensity: p.intensity,
  }));

  const chalSeeds = seededShuffle(CHALLENGE_SEEDS, seed + 7).slice(0, scale.chals);
  const challenges: DayChallenge[] = chalSeeds.map((c, i) => {
    const act = activities[i % activities.length];
    return {
      id: `daychal-${date}-${i}`,
      title: c.title,
      description: c.description.replaceAll("{act}", act.title),
    };
  });

  const headline = rainy
    ? `${weather.icon} ${weather.summary}, ${weather.precipProb}% rain — an indoor-leaning ${difficulty} day in ${location.name}`
    : `${weather.icon} ${weather.summary}, ${weather.tMin}–${weather.tMax}°C — a ${difficulty} ${mood} day in ${location.name}`;

  return { location, weather, weatherLive: args.weatherLive, mood, difficulty, headline, activities, challenges, source: "template" };
}

function extractJson<T>(text: string): T | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]) as T;
  } catch {
    return null;
  }
}

async function claudePlan(args: {
  location: GeoPoint;
  weather: DailyForecast;
  weatherLive: boolean;
  mood: Mood;
  difficulty: Difficulty;
  date: string;
}): Promise<DayPlan | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const { location, weather, mood, difficulty, date } = args;
  const scale = DIFF_SCALE[difficulty];
  try {
    const msg = await anthropic.messages.create({
      model: MODELS.interactive,
      max_tokens: 1600,
      messages: [
        {
          role: "user",
          content: `Plan one day (${date}) in ${location.name}, ${location.country} for a traveller who has never been there.
Real weather today: ${weather.summary}, ${weather.tMin}-${weather.tMax}C, ${weather.precipProb}% rain chance.
Mood: ${mood}. Difficulty: ${difficulty} (scale intensity accordingly; harder = more and richer challenges).
Return ONLY JSON: {"headline": string, "activities":[{"time":"HH:MM","title":string,"description":string,"indoor":boolean,"intensity":1|2|3}] (exactly ${scale.acts}), "challenges":[{"title":string,"description":string}] (exactly ${scale.chals}, each tied to one of the activities)}.
Activities must be real kinds of things actually available in ${location.name}, coherent as one day, weather-appropriate.`,
        },
      ],
    });
    const text = msg.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("");
    const parsed = extractJson<{
      headline: string;
      activities: { time: string; title: string; description: string; indoor: boolean; intensity: number }[];
      challenges: { title: string; description: string }[];
    }>(text);
    if (!parsed?.activities?.length) return null;
    return {
      location,
      weather,
      weatherLive: args.weatherLive,
      mood,
      difficulty,
      headline: parsed.headline || `${weather.icon} A ${difficulty} ${mood} day in ${location.name}`,
      activities: parsed.activities.slice(0, scale.acts).map((a, i) => ({
        id: `act-${date}-${i}`,
        time: a.time || SLOTS[i] || "12:00",
        title: a.title,
        description: a.description,
        indoor: !!a.indoor,
        intensity: (Math.min(3, Math.max(1, Math.round(a.intensity || 2))) as 1 | 2 | 3),
      })),
      challenges: (parsed.challenges ?? []).slice(0, scale.chals).map((c, i) => ({
        id: `daychal-${date}-${i}`,
        title: c.title,
        description: c.description,
      })),
      source: "claude",
    };
  } catch {
    return null;
  }
}

export async function findActivities(args: {
  location: string;
  date: string;
  mood: Mood;
  difficulty: Difficulty;
}): Promise<DayPlan> {
  const { location: locationName, date, mood, difficulty } = args;
  const { location, today, live } = await getTodayWeather(locationName);
  const base = { location, weather: today, weatherLive: live, mood, difficulty, date };
  return (await claudePlan(base)) ?? templatePlan(base);
}
