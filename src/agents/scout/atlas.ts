// Scout Agent — built-in destination atlas (demo-mode fallback).
// Used when ANTHROPIC_API_KEY is absent or web research fails, so Discovery
// always returns credible, sourced, safety-aware results. Same contract as
// the live path: DestinationCandidate[] from @/features/discovery/types.

import type {
  BudgetBand,
  DestinationCandidate,
  DiscoveryQuery,
} from "@/features/discovery/types";

export type VibeKey =
  | "explorer"
  | "foodie"
  | "beach"
  | "culture"
  | "adrenaline"
  | "chill";

/** Map a free-form vibe string ("4-3-3 foodie counter-attacker") to a scoring key. */
export function vibeKeyOf(vibe: string | undefined): VibeKey {
  const v = (vibe ?? "").toLowerCase();
  if (/(food|taste|eat|culinar|gourm)/.test(v)) return "foodie";
  if (/(beach|lounge|sun|island|coast)/.test(v)) return "beach";
  if (/(culture|history|art|museum|seeker|heritage)/.test(v)) return "culture";
  if (/(adrenal|advent|thrill|extreme|hardcore|active)/.test(v)) return "adrenaline";
  if (/(chill|slow|calm|zen|relax|cozy)/.test(v)) return "chill";
  return "explorer";
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface AtlasEntry {
  name: string;
  country: string;
  emoji: string;
  tagline: string;
  /** 1 = shoestring paradise … 4 = premium price tag */
  costLevel: 1 | 2 | 3 | 4;
  /** typical mid-band daily spend (USD-ish) */
  baseDaily: number;
  vibeFit: Record<VibeKey, number>;
  whyWorthIt: string[];
  bestWindow: string;
  bestMonths: number[];
  avoidMonths: number[];
  safety: DestinationCandidate["safety"];
  reviewSummary: string;
  confidence: number;
  sources: string[];
}

const ATLAS: AtlasEntry[] = [
  {
    name: "Porto, Portugal",
    country: "Portugal",
    emoji: "🇵🇹",
    tagline: "Ribeira sunsets, port-wine cellars, and a food scene punching far above its price tag.",
    costLevel: 2,
    baseDaily: 95,
    vibeFit: { explorer: 0.86, foodie: 0.92, beach: 0.55, culture: 0.84, adrenaline: 0.5, chill: 0.8 },
    whyWorthIt: [
      "Port cellars across the river in Vila Nova de Gaia run world-class tastings from around €15 — the cheapest great wine education in Europe.",
      "The UNESCO-listed Ribeira riverfront and Dom Luís I bridge can be covered entirely on foot; the whole historic core fits in a weekend.",
      "Francesinha, bifanas and petiscos: repeatedly rated among Europe's best-value food cities in traveller polls.",
      "Under 3 hours from most of Western Europe on budget carriers, so short first trips actually make sense.",
    ],
    bestWindow: "Late May–June or September: warm, golden light on the Douro, and far thinner crowds than August.",
    bestMonths: [5, 6, 9, 10],
    avoidMonths: [8, 1],
    safety: {
      rating: "low",
      notes: [
        "Pickpocketing on tram 1 and in Ribeira crowds is the main documented risk — keep phones zipped.",
        "Streets are steep, cobbled and slippery when wet; good shoes matter more than any advisory here.",
      ],
    },
    reviewSummary:
      "Travellers consistently call Porto \"Lisbon ten years ago\": friendlier prices, walkable, food the clear highlight. Recurring gripes are the hills, August cruise-ship crowds, and grey rain outside summer.",
    confidence: 0.88,
    sources: [
      "https://en.wikivoyage.org/wiki/Porto",
      "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/portugal-travel-advisory.html",
      "https://www.numbeo.com/cost-of-living/in/Porto",
      "https://www.lonelyplanet.com/portugal/porto",
      "https://www.reddit.com/r/solotravel/search/?q=porto",
    ],
  },
  {
    name: "Hoi An, Vietnam",
    country: "Vietnam",
    emoji: "🇻🇳",
    tagline: "A lantern-lit UNESCO old town with a beach 15 minutes away by bicycle — and the best cheap food of your life.",
    costLevel: 1,
    baseDaily: 45,
    vibeFit: { explorer: 0.84, foodie: 0.9, beach: 0.78, culture: 0.82, adrenaline: 0.55, chill: 0.88 },
    whyWorthIt: [
      "Cao lầu, bánh mì and white-rose dumplings for $1–2 a plate; the market food tours are legendary among backpackers and food writers alike.",
      "The old town goes car-free in the evenings and glows with silk lanterns — one of Southeast Asia's most photographed (and genuinely earned) sights.",
      "An Bang beach is a flat 15-minute cycle from the old town, so culture-plus-beach days need zero logistics.",
      "24-hour tailors will copy or design clothes to measure for a fraction of Western prices — a real, useful souvenir.",
    ],
    bestWindow: "February–April: dry season, around 28°C, before the summer heat spikes. Avoid October–November flood season.",
    bestMonths: [2, 3, 4],
    avoidMonths: [10, 11],
    safety: {
      rating: "low",
      notes: [
        "One of Vietnam's safest tourist towns; the main 'scams' are inflated tailor quotes and boat-ride overcharging — agree prices before you start.",
        "Motorbike traffic on the beach road is the biggest genuine hazard; the separated bicycle paths avoid it entirely.",
      ],
    },
    reviewSummary:
      "Reviews rave about the old town at dusk and the cooking classes; common complaints are daytime tour-bus crowds and pushy boat vendors. Repeat visitors agree: go at dawn or after 8pm and you have it to yourself.",
    confidence: 0.84,
    sources: [
      "https://en.wikivoyage.org/wiki/Hoi_An",
      "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/vietnam-travel-advisory.html",
      "https://www.tripadvisor.com/Tourism-g298082-Hoi_An_Quang_Nam_Province-Vacations.html",
      "https://www.lonelyplanet.com/vietnam/hoi-an",
    ],
  },
  {
    name: "Kyoto, Japan",
    country: "Japan",
    emoji: "🇯🇵",
    tagline: "Two thousand temples, kaiseki dinners, and streets built for slow, deliberate walking.",
    costLevel: 3,
    baseDaily: 140,
    vibeFit: { explorer: 0.82, foodie: 0.85, beach: 0.2, culture: 0.97, adrenaline: 0.4, chill: 0.82 },
    whyWorthIt: [
      "Fushimi Inari's ten thousand torii gates are free, open 24/7, and near-empty at dawn — arguably the best zero-cost sight in world travel.",
      "Nishiki Market and the machiya alleys of Gion deliver Japan's food-and-craft heritage in one compact, walkable core.",
      "Staying in a converted machiya townhouse or temple lodging (shukubo) is an experience you simply cannot have elsewhere.",
      "Nara's deer park and Osaka's street food are both under an hour away by rail, so one base covers three very different trips.",
    ],
    bestWindow: "Late October–November for fiery maple foliage, or early April for cherry blossom — both need accommodation booked far ahead.",
    bestMonths: [4, 10, 11],
    avoidMonths: [7, 8],
    safety: {
      rating: "low",
      notes: [
        "One of the safest major cities on earth — lost wallets famously get handed in. Normal city sense is plenty.",
        "The real risks are heatstroke in July–August humidity and fines for photographing geiko in Gion's private alleys — signs mark the streets.",
      ],
    },
    reviewSummary:
      "Near-universal five-star sentiment for the temples and gardens. The honest criticism in recent reviews is overtourism at Kinkaku-ji and the Arashiyama bamboo grove — and near-total agreement that going at dawn transforms the experience.",
    confidence: 0.9,
    sources: [
      "https://en.wikivoyage.org/wiki/Kyoto",
      "https://www.japan-guide.com/e/e2158.html",
      "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/japan-travel-advisory.html",
      "https://www.numbeo.com/cost-of-living/in/Kyoto",
    ],
  },
  {
    name: "Mexico City, Mexico",
    country: "Mexico",
    emoji: "🇲🇽",
    tagline: "Museums by the hundred, tacos by the thousand, and spring-like sunshine at 2,200 metres.",
    costLevel: 2,
    baseDaily: 70,
    vibeFit: { explorer: 0.9, foodie: 0.95, beach: 0.15, culture: 0.9, adrenaline: 0.65, chill: 0.55 },
    whyWorthIt: [
      "Arguably the best-value food city in the hemisphere: $1 street tacos al pastor up to world-top-ten tasting menus, often in the same block.",
      "150+ museums — more than almost any city on earth — anchored by the Anthropology Museum and Frida Kahlo's Casa Azul.",
      "The Teotihuacán pyramids are a 50-minute ride away; climbing beside the Avenue of the Dead at opening time is a genuine wonder-of-the-world moment.",
      "Roma and Condesa are leafy, walkable, café-dense neighbourhoods that make a first visit feel easy rather than overwhelming.",
    ],
    bestWindow: "March–May is dry and jacaranda-purple; November's shoulder season is quiet. Summer brings reliable (and brief) afternoon downpours.",
    bestMonths: [3, 4, 11],
    avoidMonths: [6, 7, 8, 9],
    safety: {
      rating: "moderate",
      notes: [
        "Stick to Roma, Condesa, Polanco, Centro and Coyoacán after dark, and use Uber/DiDi rather than street taxis — the advice every local gives.",
        "Card skimming and express-kidnapping are the documented scams: use ATMs inside banks. The US State Department rates CDMX 'exercise increased caution'.",
      ],
    },
    reviewSummary:
      "Recent travellers describe it as \"the most underrated food city anywhere\" and are surprised how green and walkable the core is. Complaints centre on traffic, first-week altitude breathlessness, and needing basic Spanish outside tourist zones.",
    confidence: 0.82,
    sources: [
      "https://en.wikivoyage.org/wiki/Mexico_City",
      "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/mexico-travel-advisory.html",
      "https://www.numbeo.com/cost-of-living/in/Mexico-City",
      "https://www.reddit.com/r/MexicoCity/search/?q=first+time",
    ],
  },
  {
    name: "Ljubljana, Slovenia",
    country: "Slovenia",
    emoji: "🇸🇮",
    tagline: "A fairy-tale capital you can cross on foot in twenty minutes — with the Alps an hour away.",
    costLevel: 2,
    baseDaily: 85,
    vibeFit: { explorer: 0.85, foodie: 0.7, beach: 0.35, culture: 0.78, adrenaline: 0.8, chill: 0.86 },
    whyWorthIt: [
      "The entire centre is car-free: dragon bridges, riverside cafés and a hilltop castle, all inside a 20-minute walking radius.",
      "Lake Bled, Vintgar Gorge and proper alpine hiking are day trips under 90 minutes by bus — city base, mountain holiday.",
      "A former European Green Capital: drinkable tap water, spotless streets, and sustainability baked into how the city runs.",
      "Friday's Odprta Kuhna (Open Kitchen) market turns the central square into Slovenia's best restaurant, March through October.",
    ],
    bestWindow: "May–June and September: café terraces along the Ljubljanica without July's day-trip coach crowds at Bled.",
    bestMonths: [5, 6, 9],
    avoidMonths: [1, 2],
    safety: {
      rating: "low",
      notes: [
        "Consistently ranked among Europe's safest capitals; even solo-female-travel forums struggle to name a real caution beyond standard bike-lane awareness.",
        "Mountain day trips are the real risk surface — check weather and trail grades before Triglav-area hikes.",
      ],
    },
    reviewSummary:
      "Reviewed again and again as \"Europe's most relaxing capital\" — small, clean, friendly, cheap-ish. The only recurring caveat: the city itself is two days of sights, so plan the alpine day trips or you'll run out.",
    confidence: 0.86,
    sources: [
      "https://en.wikivoyage.org/wiki/Ljubljana",
      "https://www.visitljubljana.com/en/visitors/",
      "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/slovenia-travel-advisory.html",
      "https://www.numbeo.com/cost-of-living/in/Ljubljana",
    ],
  },
  {
    name: "Taipei, Taiwan",
    country: "Taiwan",
    emoji: "🇹🇼",
    tagline: "Michelin-listed night-market stalls, misty mountain trails inside the metro map, and the world's most reassuring convenience culture.",
    costLevel: 2,
    baseDaily: 75,
    vibeFit: { explorer: 0.87, foodie: 0.93, beach: 0.4, culture: 0.8, adrenaline: 0.7, chill: 0.7 },
    whyWorthIt: [
      "Night markets like Raohe and Ningxia hold actual Michelin Bib Gourmand stalls — $3 pepper buns worth planning a trip around.",
      "Elephant Mountain's skyline view and Yangmingshan's volcanic hot springs are both reachable on the (immaculate) MRT.",
      "Beitou lets you soak in Japanese-era hot-spring bathhouses 30 minutes from downtown.",
      "Repeatedly rated one of Asia's safest and friendliest big cities for first-time solo travellers.",
    ],
    bestWindow: "October–November: typhoon season fading, mid-20s°C, clear hiking weather. March–April is the pleasant spring equivalent.",
    bestMonths: [3, 4, 10, 11],
    avoidMonths: [7, 8],
    safety: {
      rating: "low",
      notes: [
        "Violent crime against tourists is close to nonexistent; scooters rolling through crosswalks are the real daily hazard.",
        "Typhoons July–September can shut trails and delay flights — book flexible tickets if travelling in that window.",
      ],
    },
    reviewSummary:
      "Food reviews are ecstatic — \"ate for a week and never repeated a dish\" is a recurring line. Cited downsides: sticky summers, thinner English outside the capital, and grey drizzle December–February.",
    confidence: 0.85,
    sources: [
      "https://en.wikivoyage.org/wiki/Taipei",
      "https://guide.michelin.com/en/tw/taipei-region/taipei/restaurants",
      "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/taiwan-travel-advisory.html",
      "https://www.numbeo.com/cost-of-living/in/Taipei",
    ],
  },
  {
    name: "Valencia, Spain",
    country: "Spain",
    emoji: "🇪🇸",
    tagline: "Paella's actual birthplace, 300 days of sun, city beaches, and a futuristic park in a drained riverbed.",
    costLevel: 2,
    baseDaily: 90,
    vibeFit: { explorer: 0.8, foodie: 0.88, beach: 0.9, culture: 0.77, adrenaline: 0.6, chill: 0.85 },
    whyWorthIt: [
      "Paella was invented here — eat it at lunch (never dinner, locals insist) in the Albufera rice paddies where it began.",
      "The Turia gardens: 9 km of park in a drained riverbed, running from old town to the sci-fi City of Arts and Sciences.",
      "Malvarrosa beach is inside the city on the tram line — genuine culture-morning, beach-afternoon days.",
      "Reviewers consistently frame it as Barcelona's food-and-beach appeal without Barcelona's crowds, prices or pickpocket pressure.",
    ],
    bestWindow: "May–June or September: sea warm enough to swim, terraces open, none of August's 35°C. March means Las Fallas — spectacular but loud.",
    bestMonths: [4, 5, 6, 9, 10],
    avoidMonths: [8],
    safety: {
      rating: "low",
      notes: [
        "One of Spain's safer big cities; beach bag-watching and nightlife pickpockets are the standard Mediterranean cautions.",
        "During Las Fallas (mid-March) firecrackers are constant for a week — incredible, but not for noise-sensitive travellers.",
      ],
    },
    reviewSummary:
      "Frequently reviewed as \"Barcelona without the tourist fatigue\". Strong praise for the beach-plus-city combo, food and prices; the honest criticism is that individual sights are less iconic than Madrid's or Barcelona's.",
    confidence: 0.87,
    sources: [
      "https://en.wikivoyage.org/wiki/Valencia",
      "https://www.visitvalencia.com/en",
      "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/spain-travel-advisory.html",
      "https://www.numbeo.com/cost-of-living/in/Valencia",
    ],
  },
  {
    name: "Cape Town, South Africa",
    country: "South Africa",
    emoji: "🇿🇦",
    tagline: "Table Mountain sunsets, penguin beaches, and world-class wine country forty minutes from town.",
    costLevel: 2,
    baseDaily: 80,
    vibeFit: { explorer: 0.93, foodie: 0.8, beach: 0.85, culture: 0.75, adrenaline: 0.92, chill: 0.6 },
    whyWorthIt: [
      "Table Mountain, Lion's Head at sunrise, and the Cape Point coastal drive form maybe the highest scenery-per-day ratio of any city on earth.",
      "African penguins waddle across Boulders Beach — a bucket-list sight that costs a few dollars' conservation fee.",
      "Stellenbosch and Franschhoek wine estates pour tastings for under $10; the exchange rate turns fine dining into casual spending.",
      "Adrenaline menu is unmatched: paragliding off Lion's Head, surfing Muizenberg, shark-cage diving in season.",
    ],
    bestWindow: "February–March: peak-summer wind eases, the sea is at its warmest, and January's school-holiday crowds are gone.",
    bestMonths: [2, 3, 11],
    avoidMonths: [6, 7],
    safety: {
      rating: "elevated",
      notes: [
        "Opportunistic crime is real: no phones out walking after dark, Uber everywhere at night, and don't hike isolated trails alone on weekdays.",
        "Tourist zones (V&A Waterfront, Camps Bay, the winelands) are well-policed; visit townships only with a local guide. Check load-shedding schedules — outages have eased but still happen.",
      ],
    },
    reviewSummary:
      "Reviewers routinely call it the most beautiful city in the world and rate the value \"unbeatable\". The constant theme is loving it while staying streetwise — travellers who defaulted to Uber and guided outings overwhelmingly report zero incidents.",
    confidence: 0.8,
    sources: [
      "https://en.wikivoyage.org/wiki/Cape_Town",
      "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/south-africa-travel-advisory.html",
      "https://www.capetown.travel/",
      "https://www.numbeo.com/cost-of-living/in/Cape-Town",
    ],
  },
];

const BAND_LEVEL: Record<BudgetBand, number> = {
  shoestring: 1,
  mid: 2,
  comfortable: 3,
  luxury: 4,
};

const BAND_SPEND_MULT: Record<BudgetBand, number> = {
  shoestring: 0.7,
  mid: 1,
  comfortable: 1.45,
  luxury: 2.2,
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Rank the built-in atlas against the query. Deterministic, instant, and
 * shaped identically to the live web-research path.
 */
export function rankAtlas(query: DiscoveryQuery): DestinationCandidate[] {
  const key = vibeKeyOf(query.vibe);
  const band: BudgetBand = query.budgetBand ?? "mid";
  const bandLevel = BAND_LEVEL[band];
  const month = query.month;

  return ATLAS.map((d): DestinationCandidate => {
    let fit = d.vibeFit[key];
    // budget alignment: distance between the destination's cost level and the band
    fit -= Math.abs(d.costLevel - bandLevel) * 0.05;

    let bestWindow = d.bestWindow;
    if (month && month >= 1 && month <= 12) {
      const label = MONTH_NAMES[month - 1];
      if (d.bestMonths.includes(month)) {
        fit += 0.06;
        bestWindow += ` ${label} lands right in the sweet spot.`;
      } else if (d.avoidMonths.includes(month)) {
        fit -= 0.1;
        bestWindow += ` Heads-up: ${label} is the season to avoid here.`;
      } else {
        bestWindow += ` ${label} is workable, just outside the prime window.`;
      }
    }

    return {
      name: d.name,
      country: d.country,
      emoji: d.emoji,
      tagline: d.tagline,
      fitScore: Math.round(clamp(fit, 0.3, 0.99) * 100) / 100,
      whyWorthIt: d.whyWorthIt,
      bestWindow,
      estDailyBudget: Math.round(d.baseDaily * BAND_SPEND_MULT[band]),
      safety: d.safety,
      reviewSummary: d.reviewSummary,
      confidence: d.confidence,
      sources: d.sources,
    };
  }).sort((a, b) => b.fitScore - a.fitScore);
}
