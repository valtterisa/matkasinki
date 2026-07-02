// Discovery — "where is worth going, never having been there before?"

export type BudgetBand = "shoestring" | "mid" | "comfortable" | "luxury";

export interface DiscoveryQuery {
  vibe: string;                 // from onboarding quiz, e.g. "foodie-explorer"
  datesWindow?: { earliest: string; latest: string };
  month?: number;               // 1-12 — preferred travel month (low-effort alternative to datesWindow)
  budgetBand?: BudgetBand;
  maxTravelHours?: number;
  originCity?: string;
  mustHaves?: string[];         // e.g. ["beach", "good coffee"]
  dealBreakers?: string[];      // e.g. ["long flights"]
  sustainableOnly?: boolean;    // defaults on; user can disable in settings
}

export interface DestinationCandidate {
  name: string;                 // "Porto, Portugal"
  country?: string;             // "Portugal"
  emoji?: string;               // "🇵🇹" — for the card header
  tagline?: string;             // one-line hook, not marketing fluff
  fitScore: number;             // 0..1 match to vibe + constraints
  whyWorthIt: string[];         // concrete, sourced reasons
  bestWindow?: string;          // "late May — fewer crowds, mild weather"
  estDailyBudget?: number;      // in user's currency
  safety: { rating: "low" | "moderate" | "elevated"; notes: string[] };
  reviewSummary: string;        // distilled from real tourist reviews
  confidence: number;           // 0..1 — how corroborated across sources
  sources: string[];            // URLs the Scout Agent actually read
}
