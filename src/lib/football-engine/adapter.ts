// Boundary to the football engine (§17). App code talks to THIS interface only,
// so the in-process TypeScript simulator below can be swapped for the OSS Rust
// engine (ZOXEXIVO/open-football) running headless without touching features.
//
// Pure + deterministic: same inputs + same seed => same match. No fs, no network,
// client-safe.

export interface EnginePlayer {
  id: number;
  name: string;
  position: string; // DB position code: GK, DC, MC, ST, ...
  ability: number; // 0-200 (open-football scale)
}

export interface EngineStaff {
  name: string;
  role: string;
}

export interface EngineOpponent {
  id: string;
  name: string;
  ability: number; // avg squad ability, 0-200
  players?: string[]; // optional real names for the commentary
}

export type MatchEventType =
  | "kickoff" | "chance" | "save" | "goal" | "card" | "halftime" | "fulltime";

export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  team?: "home" | "away";
  player?: string;
  detail: string;
}

export interface MatchResult {
  homeName: string;
  awayName: string;
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
  motm: { name: string; team: "home" | "away" };
  seed: number;
}

export interface FootballEngine {
  createClub(identity: { name: string; formation: string }): Promise<{ clubId: string }>;
  addPlayer(clubId: string, player: EnginePlayer): Promise<void>;
  addStaff(clubId: string, staff: EngineStaff): Promise<void>;
  simulateFixture(clubId: string, opponent: EngineOpponent, seed?: number): Promise<MatchResult>;
}

/* ---------------- seeded randomness ---------------- */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------- the pure simulator ---------------- */

const CHANCE_FLAVOR = [
  "curls one toward the top corner",
  "breaks clear down the right and squares it",
  "wins the header from the corner",
  "lets fly from 25 yards",
  "dances past two and shoots low",
  "gets on the end of a slide-rule through ball",
  "attempts an audacious chip",
  "smashes a half-volley on the turn",
];

const SAVE_FLAVOR = [
  "brilliant fingertip save!",
  "the keeper stands tall and blocks",
  "clatters off the crossbar!",
  "dragged inches wide of the post",
  "a last-ditch tackle denies it",
];

const GOAL_FLAVOR = [
  "GOAL! An emphatic finish!",
  "GOAL! Buried into the bottom corner!",
  "GOAL! The net bulges — the bench erupts!",
  "GOAL! A thing of beauty!",
  "GOAL! Poked home in the scramble!",
];

interface SimTeam {
  name: string;
  ability: number;
  attackers: string[]; // names weighted toward chances
  anyone: string[];
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Minute-by-minute match simulation weighted by ability difference.
 * Exported standalone so API routes can use it without engine bookkeeping.
 */
export function simulateMatch(
  home: { name: string; ability: number; playerNames?: string[] },
  away: { name: string; ability: number; playerNames?: string[] },
  seed: number,
): MatchResult {
  const rng = mulberry32(seed);
  const mk = (t: { name: string; ability: number; playerNames?: string[] }): SimTeam => {
    const names = t.playerNames && t.playerNames.length > 0
      ? t.playerNames
      : [`${t.name} No. 9`, `${t.name} No. 10`, `${t.name} No. 7`, `${t.name} No. 8`, `${t.name} No. 11`];
    return { name: t.name, ability: t.ability, attackers: names.slice(0, 6), anyone: names };
  };
  const h = mk(home);
  const a = mk(away);

  // Ability difference -> share of chances + conversion. Small home edge.
  const diff = Math.max(-80, Math.min(80, h.ability - a.ability + 6));
  const homeShare = Math.max(0.18, Math.min(0.82, 0.5 + diff / 180));

  const events: MatchEvent[] = [];
  const scorers = new Map<string, { count: number; team: "home" | "away" }>();
  let hg = 0;
  let ag = 0;

  events.push({
    minute: 1, type: "kickoff",
    detail: `We're underway! ${h.name} vs ${a.name} — the referee gets us started.`,
  });

  const totalChances = 7 + Math.floor(rng() * 7); // 7-13
  const minutes = new Set<number>();
  while (minutes.size < totalChances) {
    const m = 3 + Math.floor(rng() * 87);
    if (m !== 45) minutes.add(m);
  }

  for (const minute of [...minutes].sort((x, y) => x - y)) {
    const isHome = rng() < homeShare;
    const team: "home" | "away" = isHome ? "home" : "away";
    const side = isHome ? h : a;
    const player = pick(side.attackers, rng);

    // occasional booking instead of a chance
    if (rng() < 0.14) {
      const offender = pick((isHome ? a : h).anyone, rng);
      events.push({
        minute, type: "card", team: isHome ? "away" : "home", player: offender,
        detail: `Yellow card — ${offender} cynically stops the break.`,
      });
      continue;
    }

    events.push({
      minute, type: "chance", team, player,
      detail: `${player} ${pick(CHANCE_FLAVOR, rng)}...`,
    });

    const convert = 0.24 + (isHome ? diff : -diff) / 800; // ability nudges conversion
    if (rng() < Math.max(0.1, Math.min(0.45, convert))) {
      if (isHome) hg++; else ag++;
      const prev = scorers.get(player);
      scorers.set(player, { count: (prev?.count ?? 0) + 1, team });
      events.push({
        minute, type: "goal", team, player,
        detail: `${pick(GOAL_FLAVOR, rng)} ${player} makes it ${hg}–${ag}.`,
      });
    } else {
      events.push({
        minute, type: "save", team, player,
        detail: `...but ${pick(SAVE_FLAVOR, rng)}`,
      });
    }
  }

  // insert half/full time markers in order
  const ht: MatchEvent = { minute: 45, type: "halftime", detail: "Half-time. Time for the tactics board." };
  const ftScore = `${hg}–${ag}`;
  const ft: MatchEvent = {
    minute: 90, type: "fulltime",
    detail: `Full-time: ${h.name} ${ftScore} ${a.name}. ${hg > ag ? `${h.name} take the spoils!` : hg < ag ? `${a.name} silence the home crowd!` : "Honours even — a share of the points."}`,
  };
  const ordered = [...events, ht].sort((x, y) => x.minute - y.minute || (x.type === "halftime" ? 1 : 0));
  ordered.push(ft);

  // MOTM: top scorer, else the winning side's most involved player, else home keeper narrative
  let motm: MatchResult["motm"];
  const topScorer = [...scorers.entries()].sort((x, y) => y[1].count - x[1].count)[0];
  if (topScorer) {
    motm = { name: topScorer[0], team: topScorer[1].team };
  } else {
    const side = hg >= ag ? h : a;
    motm = { name: pick(side.anyone, rng), team: hg >= ag ? "home" : "away" };
  }

  return {
    homeName: h.name, awayName: a.name,
    homeGoals: hg, awayGoals: ag,
    events: ordered, motm, seed,
  };
}

/* ---------------- in-process engine (the current implementation) ---------------- */

interface ClubRecord {
  name: string;
  formation: string;
  players: EnginePlayer[];
  staff: EngineStaff[];
}

class LocalFootballEngine implements FootballEngine {
  private clubs = new Map<string, ClubRecord>();
  private counter = 0;

  async createClub(identity: { name: string; formation: string }): Promise<{ clubId: string }> {
    const clubId = `club_${++this.counter}_${identity.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    this.clubs.set(clubId, { ...identity, players: [], staff: [] });
    return { clubId };
  }

  async addPlayer(clubId: string, player: EnginePlayer): Promise<void> {
    this.require(clubId).players.push(player);
  }

  async addStaff(clubId: string, staff: EngineStaff): Promise<void> {
    this.require(clubId).staff.push(staff);
  }

  async simulateFixture(clubId: string, opponent: EngineOpponent, seed?: number): Promise<MatchResult> {
    const club = this.require(clubId);
    const ability = club.players.length > 0
      ? club.players.reduce((s, p) => s + p.ability, 0) / club.players.length
      : 92;
    // Each staff member is worth a small edge on matchday — coaching matters.
    const staffEdge = Math.min(8, club.staff.length * 2);
    return simulateMatch(
      {
        name: club.name,
        ability: ability + staffEdge,
        playerNames: club.players
          .filter((p) => p.position !== "GK")
          .sort((x, y) => y.ability - x.ability)
          .map((p) => p.name),
      },
      { name: opponent.name, ability: opponent.ability, playerNames: opponent.players },
      seed ?? Math.floor(Math.random() * 2 ** 31),
    );
  }

  private require(clubId: string): ClubRecord {
    const c = this.clubs.get(clubId);
    if (!c) throw new Error(`unknown clubId: ${clubId}`);
    return c;
  }
}

let engine: FootballEngine | null = null;

/** The single engine entry point. Swap the implementation here — nowhere else. */
export function getEngine(): FootballEngine {
  if (!engine) engine = new LocalFootballEngine();
  return engine;
}
