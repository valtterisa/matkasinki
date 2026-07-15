// Tiny JSON-file-backed store for demo state (server-side, no DB needed).
// Holds the user's profile, trip, verified travel events, and club state.
// Travel core WRITES events; football layer READS them. One direction only.

import fs from "node:fs";
import path from "node:path";

const STATE_DIR = path.join(process.cwd(), ".data");
const STATE_FILE = path.join(STATE_DIR, "state.json");

export type TravelEvent =
  | { kind: "place_visited"; placeId: string; verified: boolean; at: string }
  | { kind: "challenge_completed"; challengeId: string; verified: boolean; at: string }
  | { kind: "budget_kept"; tripId: string; underBy: number; at: string }
  | { kind: "activity_done"; activityId: string; at: string };

export interface SquadPlayer {
  id: number;
  name: string;
  position: string;
  ability: number;
  scoutedIn: string; // place the user earned them, e.g. "Porto, Portugal"
}

export interface StaffMember {
  name: string;
  role: string; // coach, physio, scout, analyst, board
  scoutedIn: string;
}

export interface AppState {
  profile?: {
    vibe: string;
    clubName: string;
    formation: string;
    colors: string[];
    flavor: string;
  };
  trip?: {
    destination: string;
    dates: { start: string; end: string };
    budget?: number;
    itinerary?: unknown;
  };
  expenses: { amount: number; currency: string; category: string; note?: string; at: string }[];
  events: TravelEvent[];
  club: {
    squad: SquadPlayer[];
    staff: StaffMember[];
    leagueTier: number; // index into LEAGUES ladder (0 = Check-In Cup)
    transferBudget: number;
    morale: number; // 0-100
  };
  settings: { sustainableChallenges: boolean; difficulty: "chill" | "standard" | "adventurous" | "hardcore" };
}

const DEFAULT_STATE: AppState = {
  expenses: [],
  events: [],
  club: { squad: [], staff: [], leagueTier: 0, transferBudget: 1_000_000, morale: 60 },
  settings: { sustainableChallenges: true, difficulty: "standard" },
};

export function readState(): AppState {
  try {
    return { ...DEFAULT_STATE, ...JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export function writeState(state: AppState): void {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function updateState(fn: (s: AppState) => void): AppState {
  const s = readState();
  fn(s);
  writeState(s);
  return s;
}
