// Rivals (§15) — AI rival managers built from REAL database clubs + countries.
// SERVER-ONLY (reads the football DB). Rival numbers evolve deterministically
// with the calendar date so the league feels alive between visits, with zero
// stored state and zero randomness drift.

import fs from "node:fs";
import path from "node:path";
import { getClubs, getCountryByCode, getLeagues, isDbAvailable } from "@/lib/db";
import { hashString, mulberry32, tierForVerifiedCount } from "../index";

export interface Rival {
  id: string;
  managerName: string;
  nationality: string;
  countryCode: string;
  clubName: string;
  clubOrigin: string; // "Primeira Liga · Portugal"
  scoutingIn: string; // rotates daily
  verifiedChallenges: number;
  squadStrength: number; // 0-200 scale, same as user's squad
  tier: number;
  persona: string;
}

interface RivalSeed {
  id: string;
  countryCode: string;
  fallbackManager: string;
  fallbackClub: string;
  fallbackNation: string;
  persona: string;
  baseChallenges: number;
  challengeRate: number; // verified challenges gained per day
  baseStrength: number;
  cities: string[];
}

const RIVAL_SEEDS: RivalSeed[] = [
  {
    id: "rival-aurora", countryCode: "pt",
    fallbackManager: "Rui Tavares", fallbackClub: "Atlético do Vale", fallbackNation: "Portugal",
    persona: "The romantic — plans entire trips around bakeries and sunset viewpoints.",
    baseChallenges: 4, challengeRate: 0.31, baseStrength: 104,
    cities: ["Porto", "Madeira", "Coimbra", "Lisbon", "Braga"],
  },
  {
    id: "rival-katsu", countryCode: "jp",
    fallbackManager: "Kenji Hoshino", fallbackClub: "Shonan Mariners", fallbackNation: "Japan",
    persona: "The perfectionist — colour-coded itineraries, never misses a train.",
    baseChallenges: 7, challengeRate: 0.24, baseStrength: 112,
    cities: ["Kyoto", "Osaka", "Sapporo", "Tokyo", "Nara"],
  },
  {
    id: "rival-gaucho", countryCode: "ar",
    fallbackManager: "Marcelo Ibarra", fallbackClub: "Defensores del Sur", fallbackNation: "Argentina",
    persona: "The improviser — books flights at midnight, somehow always under budget.",
    baseChallenges: 2, challengeRate: 0.42, baseStrength: 96,
    cities: ["Buenos Aires", "Mendoza", "Bariloche", "Córdoba", "Salta"],
  },
  {
    id: "rival-fjord", countryCode: "no",
    fallbackManager: "Sigrid Halvorsen", fallbackClub: "Nordlys IF", fallbackNation: "Norway",
    persona: "The endurance freak — counts a 20km hike as 'a light warm-up'.",
    baseChallenges: 9, challengeRate: 0.18, baseStrength: 118,
    cities: ["Bergen", "Tromsø", "Lofoten", "Oslo", "Ålesund"],
  },
];

function daysSinceEpoch(date: Date): number {
  return Math.floor(date.getTime() / 86_400_000) - 20_454; // ~2026-01-01 anchor
}

function readNames(countryCode: string): { first: string[]; last: string[] } | null {
  try {
    const p = path.join(
      process.cwd(), "data", "open-football-database", "data", countryCode, "names.json",
    );
    const raw = JSON.parse(fs.readFileSync(p, "utf8")) as {
      first_names?: string[]; last_names?: string[];
    };
    if (raw.first_names?.length && raw.last_names?.length) {
      return { first: raw.first_names, last: raw.last_names };
    }
  } catch { /* fall through */ }
  return null;
}

/** The 4 AI rivals, deterministic for a given date. */
export function getRivals(date = new Date()): Rival[] {
  const days = Math.max(0, daysSinceEpoch(date));
  const dbOk = isDbAvailable();

  return RIVAL_SEEDS.map((seed) => {
    const h = hashString(seed.id);
    const rng = mulberry32(h);

    let managerName = seed.fallbackManager;
    let clubName = seed.fallbackClub;
    let clubOrigin = seed.fallbackNation;
    let nationality = seed.fallbackNation;

    if (dbOk) {
      const country = getCountryByCode(seed.countryCode);
      if (country) nationality = country.name;
      const names = readNames(seed.countryCode);
      if (names) {
        managerName = `${names.first[h % names.first.length]} ${
          names.last[(h >>> 8) % names.last.length]}`;
      }
      const leagues = getLeagues(seed.countryCode);
      if (leagues.length > 0) {
        const league = leagues[0];
        const clubs = getClubs(seed.countryCode, league.slug);
        if (clubs.length > 0) {
          const club = clubs[(h >>> 4) % clubs.length];
          clubName = club.name;
          clubOrigin = `${league.name} · ${nationality}`;
        }
      }
    }

    // Deterministic "alive" evolution: steady growth + a gentle weekly wobble.
    const wobble = Math.sin((days + (h % 7)) / 3.1) * 2;
    const verifiedChallenges = Math.max(
      0,
      Math.floor(seed.baseChallenges + days * seed.challengeRate + rng() * 2),
    );
    const squadStrength = Math.round(
      Math.min(178, seed.baseStrength + days * 0.12 + wobble),
    );
    const scoutingIn = seed.cities[(days + (h % seed.cities.length)) % seed.cities.length];

    return {
      id: seed.id,
      managerName,
      nationality,
      countryCode: seed.countryCode,
      clubName,
      clubOrigin,
      scoutingIn,
      verifiedChallenges,
      squadStrength,
      tier: tierForVerifiedCount(verifiedChallenges),
      persona: seed.persona,
    };
  });
}

/* ---------------- friend invites (accounts are future work) ---------------- */

export interface MockInvite {
  email: string;
  code: string;
  url: string;
  note: string;
}

/**
 * Creates a MOCK invite link. Real head-to-head needs accounts (auth, profiles,
 * shared clubs) — explicitly future work per §15; the UI badges this.
 */
export async function inviteFriend(email: string): Promise<MockInvite> {
  const code = hashString(`${email.toLowerCase()}::prompt-holiday`).toString(36).slice(0, 8);
  return {
    email,
    code,
    url: `/rivals?invite=${code}`,
    note: "Multiplayer accounts are future work — this link is a preview stub.",
  };
}
