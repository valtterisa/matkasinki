// Server-side loader for the ZOXEXIVO/open-football-database (data/open-football-database).
// Layout: data/{countryCode}/{league-slug}/league.json
//         data/{countryCode}/{league-slug}/{club-slug}/club.json
//         data/{countryCode}/{league-slug}/{club-slug}/players/*.json
// Read lazily via fs — never bundle (60k+ files).

import fs from "node:fs";
import path from "node:path";

// Path resolves in this order so the same code works in dev, `next start`, and a
// packaged Electron app (where the DB ships as an unpacked resource):
//   1. FOOTBALL_DB_DIR env (set by the Electron main process to resourcesPath)
//   2. cwd()/data/open-football-database/data (repo / dev)
const DB_ROOT =
  process.env.FOOTBALL_DB_DIR ||
  path.join(process.cwd(), "data", "open-football-database", "data");

export interface DbCountry {
  id: number;
  code: string;
  slug: string;
  name: string;
  continent_id: number;
  reputation: number;
  background_color?: string;
  foreground_color?: string;
}

export interface DbLeague {
  id: number;
  slug: string;
  name: string;
  reputation: number;
  tier: number;
  countryCode: string;
}

export interface DbClub {
  id: number;
  name: string;
  slug: string;
  countryCode: string;
  leagueSlug: string;
  finance?: { balance: number };
  reputation?: number;
}

export interface DbPlayer {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  country_id: number;
  club_id: number;
  positions: { code: string; level: number }[];
  current_ability: number;
  potential_ability: number;
  value: number;
}

function readJson<T>(p: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as T;
  } catch {
    return null;
  }
}

export function isDbAvailable(): boolean {
  return fs.existsSync(DB_ROOT);
}

let countriesCache: DbCountry[] | null = null;
export function getCountries(): DbCountry[] {
  if (!countriesCache) {
    countriesCache = readJson<DbCountry[]>(path.join(DB_ROOT, "countries.json")) ?? [];
  }
  return countriesCache;
}

export function getCountryByCode(code: string): DbCountry | undefined {
  return getCountries().find((c) => c.code === code.toLowerCase());
}

/** Country codes that actually have league folders on disk. */
export function getPlayableCountryCodes(): string[] {
  if (!isDbAvailable()) return [];
  return fs
    .readdirSync(DB_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function getLeagues(countryCode: string): DbLeague[] {
  const dir = path.join(DB_ROOT, countryCode.toLowerCase());
  if (!fs.existsSync(dir)) return [];
  const out: DbLeague[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "free_agents") continue;
    const league = readJson<Omit<DbLeague, "countryCode">>(
      path.join(dir, entry.name, "league.json"),
    );
    if (league) out.push({ ...league, slug: entry.name, countryCode: countryCode.toLowerCase() });
  }
  return out.sort((a, b) => a.tier - b.tier);
}

export function getClubs(countryCode: string, leagueSlug: string): DbClub[] {
  const dir = path.join(DB_ROOT, countryCode.toLowerCase(), leagueSlug);
  if (!fs.existsSync(dir)) return [];
  const out: DbClub[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const raw = readJson<{
      id: number;
      name: string;
      finance?: { balance: number };
      teams?: { team_type: string; reputation?: { world?: number } }[];
    }>(path.join(dir, entry.name, "club.json"));
    if (raw) {
      const main = raw.teams?.find((t) => t.team_type === "Main");
      out.push({
        id: raw.id,
        name: raw.name,
        slug: entry.name,
        countryCode: countryCode.toLowerCase(),
        leagueSlug,
        finance: raw.finance,
        reputation: main?.reputation?.world,
      });
    }
  }
  return out;
}

export function getPlayers(countryCode: string, leagueSlug: string, clubSlug: string): DbPlayer[] {
  const dir = path.join(DB_ROOT, countryCode.toLowerCase(), leagueSlug, clubSlug, "players");
  if (!fs.existsSync(dir)) return [];
  const out: DbPlayer[] = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".json")) continue;
    const p = readJson<DbPlayer>(path.join(dir, f));
    if (p) out.push(p);
  }
  return out.sort((a, b) => b.current_ability - a.current_ability);
}

/** Deterministic pick of N players from a country, for "scouted in <place>" rewards. */
export function scoutPlayersFromCountry(countryCode: string, n: number, seed = 0): DbPlayer[] {
  const leagues = getLeagues(countryCode);
  if (leagues.length === 0) return [];
  const league = leagues[seed % leagues.length];
  const clubs = getClubs(countryCode, league.slug);
  if (clubs.length === 0) return [];
  const club = clubs[seed % clubs.length];
  return getPlayers(countryCode, league.slug, club.slug).slice(0, n);
}
