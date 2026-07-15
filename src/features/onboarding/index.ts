// Onboarding — "Manager Induction" vibe quiz (the demo hook, ~60s live).
// Pure, deterministic, client-safe: quiz data + scoring, no LLM involved.
// The resulting profile feeds Discovery, Trip Planner, Activity Finder, and Scout.

export type Archetype =
  | "explorer"
  | "foodie"
  | "beach-lounger"
  | "culture-seeker"
  | "adrenaline";

/** Deterministic tie-break order (first wins on equal score). */
export const ARCHETYPE_ORDER: Archetype[] = [
  "explorer",
  "foodie",
  "beach-lounger",
  "culture-seeker",
  "adrenaline",
];

export interface ClubIdentity {
  clubName: string;
  /** Exactly two kit hexes: [primary, secondary]. */
  colors: [string, string];
  formation: string;
  flavor: string;
}

export interface ArchetypeDef {
  id: Archetype;
  /** Display name, e.g. "The Explorer". */
  label: string;
  emoji: string;
  tagline: string;
  club: ClubIdentity;
}

export const ARCHETYPES: Record<Archetype, ArchetypeDef> = {
  explorer: {
    id: "explorer",
    label: "The Explorer",
    emoji: "🧭",
    tagline: "If it's on the map, it's already too mainstream.",
    club: {
      clubName: "FC Wanderlust",
      colors: ["#34d399", "#0b3d2e"],
      formation: "4-3-3",
      flavor:
        "You're a 4-3-3 Explorer box-to-box engine — high line, higher altitude, always pressing into unmapped half-spaces.",
    },
  },
  foodie: {
    id: "foodie",
    label: "The Foodie",
    emoji: "🥘",
    tagline: "You don't follow itineraries. You follow smells.",
    club: {
      clubName: "Tapas Town FC",
      colors: ["#fbbf24", "#7c2d12"],
      formation: "4-2-3-1",
      flavor:
        "You're a 4-2-3-1 Foodie counter-attacker — patient buildup, lethal at lunchtime, world-class in the final course.",
    },
  },
  "beach-lounger": {
    id: "beach-lounger",
    label: "The Beach-lounger",
    emoji: "🏖️",
    tagline: "Peak performance is horizontal.",
    club: {
      clubName: "Costa del Calma CF",
      colors: ["#38bdf8", "#fde68a"],
      formation: "5-4-1",
      flavor:
        "You're a 5-4-1 Beach-lounger low-block maestro — park the sunbed, keep possession of the best spot, win on penalties (for effort).",
    },
  },
  "culture-seeker": {
    id: "culture-seeker",
    label: "The Culture-seeker",
    emoji: "🏛️",
    tagline: "Every alleyway is an archive. Every museum, a masterclass.",
    club: {
      clubName: "Real Renaissance",
      colors: ["#a78bfa", "#f8fafc"],
      formation: "4-4-2",
      flavor:
        "You're a 4-4-2 Culture-seeker classicist — museum-grade passing, diamond in midfield, plays the beautiful game by the old masters.",
    },
  },
  adrenaline: {
    id: "adrenaline",
    label: "The Adrenaline Junkie",
    emoji: "⚡",
    tagline: "Your comfort zone filed a missing-person report.",
    club: {
      clubName: "Rapid Vertigo FC",
      colors: ["#f87171", "#111827"],
      formation: "3-4-3",
      flavor:
        "You're a 3-4-3 Adrenaline gegenpresser — full throttle, no brakes, wins the ball back before your parachute even opens.",
    },
  },
};

export interface QuizOption {
  id: string;
  label: string;
  emoji: string;
  /** Points awarded per archetype when picked. */
  scores: Partial<Record<Archetype, number>>;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  /** Small kicker line above the question, football-scout flavoured. */
  kicker: string;
  options: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "kickoff",
    kicker: "Kick-off · Scouting report 1/5",
    prompt: "Wheels touch down in a city you've never seen. First move, gaffer?",
    options: [
      {
        id: "wander",
        label: "Drop the bags, pick a random street, get gloriously lost",
        emoji: "🗺️",
        scores: { explorer: 2, adrenaline: 1 },
      },
      {
        id: "market",
        label: "Straight to the market — taste the city before you see it",
        emoji: "🍜",
        scores: { foodie: 2, "culture-seeker": 1 },
      },
      {
        id: "pool",
        label: "Find the pool. The city can wait, it's not going anywhere",
        emoji: "🍹",
        scores: { "beach-lounger": 2 },
      },
      {
        id: "oldtown",
        label: "Old town first — read every plaque like it's the team sheet",
        emoji: "🏛️",
        scores: { "culture-seeker": 2, explorer: 1 },
      },
    ],
  },
  {
    id: "training",
    kicker: "First half · Scouting report 2/5",
    prompt: "Pre-season training. Which session do you actually show up for?",
    options: [
      {
        id: "cliff",
        label: "Cliff jump at dawn — the physio has been notified",
        emoji: "🪂",
        scores: { adrenaline: 2, explorer: 1 },
      },
      {
        id: "cooking",
        label: "Cooking class with a local nonna — tactical masterclass",
        emoji: "👩‍🍳",
        scores: { foodie: 2 },
      },
      {
        id: "hike",
        label: "Off-trail hike to a viewpoint no bus can reach",
        emoji: "🥾",
        scores: { explorer: 2, adrenaline: 1 },
      },
      {
        id: "recovery",
        label: "\"Recovery day.\" Hammock. Book optional, snacks mandatory",
        emoji: "🏖️",
        scores: { "beach-lounger": 2 },
      },
    ],
  },
  {
    id: "camera",
    kicker: "Half-time · Scouting report 3/5",
    prompt: "Your camera roll after any trip is mostly…",
    options: [
      {
        id: "plates",
        label: "47 photos of plates. Zero of you",
        emoji: "📸",
        scores: { foodie: 2 },
      },
      {
        id: "sunsets",
        label: "Sunsets from the exact same sun-lounger, daily",
        emoji: "🌅",
        scores: { "beach-lounger": 2, "culture-seeker": 1 },
      },
      {
        id: "blurry",
        label: "Blurry action shots — something was moving fast (it was you)",
        emoji: "💨",
        scores: { adrenaline: 2 },
      },
      {
        id: "doors",
        label: "Cathedral ceilings, weird doors, and museum tickets",
        emoji: "🎟️",
        scores: { "culture-seeker": 2 },
      },
      {
        id: "nowhere",
        label: "Places with no name on Google Maps yet",
        emoji: "📍",
        scores: { explorer: 2 },
      },
    ],
  },
  {
    id: "transfer",
    kicker: "Second half · Scouting report 4/5",
    prompt: "Surprise transfer budget: €200 to burn in one afternoon. Where does it go?",
    options: [
      {
        id: "tasting",
        label: "A 12-course tasting menu. Yes, all twelve",
        emoji: "🍷",
        scores: { foodie: 2, "culture-seeker": 1 },
      },
      {
        id: "rental",
        label: "Rent a scooter/kayak/anything with a throttle or a paddle",
        emoji: "🛵",
        scores: { adrenaline: 2, explorer: 1 },
      },
      {
        id: "daytrip",
        label: "A day trip to the tiny village nobody's heard of",
        emoji: "🚂",
        scores: { explorer: 2 },
      },
      {
        id: "spa",
        label: "Beach club daybed + spa. Invoice it to the board",
        emoji: "🧖",
        scores: { "beach-lounger": 2 },
      },
    ],
  },
  {
    id: "fulltime",
    kicker: "Full time · Scouting report 5/5",
    prompt: "Post-match interview: \"That trip was a success because…\"",
    options: [
      {
        id: "story",
        label: "\"…I have a story nobody will believe without the scars\"",
        emoji: "🏆",
        scores: { adrenaline: 2 },
      },
      {
        id: "dish",
        label: "\"…I can still taste that one dish. I dream about it\"",
        emoji: "😮‍💨",
        scores: { foodie: 2 },
      },
      {
        id: "rested",
        label: "\"…I came back a fully recharged human being\"",
        emoji: "🔋",
        scores: { "beach-lounger": 2 },
      },
      {
        id: "learned",
        label: "\"…I finally get why that empire fell. Fascinating stuff\"",
        emoji: "📜",
        scores: { "culture-seeker": 2 },
      },
      {
        id: "everywhere",
        label: "\"…I went everywhere. EVERYWHERE\"",
        emoji: "🌍",
        scores: { explorer: 2 },
      },
    ],
  },
];

export interface QuizResult {
  archetype: ArchetypeDef;
  /** Final tally per archetype (useful for debugging / secondary vibes). */
  scores: Record<Archetype, number>;
}

/**
 * Deterministic client-side scoring. `answers` is one picked option index per
 * question, in question order. Ties break by ARCHETYPE_ORDER.
 */
export function scoreQuiz(answers: number[]): QuizResult {
  const scores: Record<Archetype, number> = {
    explorer: 0,
    foodie: 0,
    "beach-lounger": 0,
    "culture-seeker": 0,
    adrenaline: 0,
  };

  QUESTIONS.forEach((q, i) => {
    const option = q.options[answers[i]];
    if (!option) return;
    for (const [arch, pts] of Object.entries(option.scores)) {
      scores[arch as Archetype] += pts ?? 0;
    }
  });

  let winner: Archetype = ARCHETYPE_ORDER[0];
  for (const arch of ARCHETYPE_ORDER) {
    if (scores[arch] > scores[winner]) winner = arch;
  }

  return { archetype: ARCHETYPES[winner], scores };
}

/** Shape persisted to AppState.profile via POST /api/onboarding. */
export interface OnboardingProfile {
  vibe: Archetype;
  clubName: string;
  formation: string;
  colors: string[];
  flavor: string;
}

export function toProfile(result: QuizResult): OnboardingProfile {
  const { id, club } = result.archetype;
  return {
    vibe: id,
    clubName: club.clubName,
    formation: club.formation,
    colors: [...club.colors],
    flavor: club.flavor,
  };
}
