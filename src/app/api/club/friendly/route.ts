// POST /api/club/friendly — simulate a friendly vs a REAL club from the
// open-football-database, picked near the user's current cup tier. Returns a
// minute-by-minute match report (score, timeline, MOTM) from the engine adapter.

import { NextResponse } from "next/server";
import { readState } from "@/lib/store";
import { deriveClub, squadStrength } from "@/features/club/derive";
import { LEAGUES } from "@/features/club";
import { simulateMatch } from "@/lib/football-engine/adapter";
import { getClubs, getLeagues, getPlayers, isDbAvailable, getCountryByCode } from "@/lib/db";

export const dynamic = "force-dynamic";

// Tier -> countries whose top league supplies opponents. Higher cup tier =>
// grander opposition, so climbing the ladder feels real.
const TIER_POOLS: string[][] = [
  ["cy", "mt", "is", "fi", "ee"], // Check-In Cup
  ["gr", "hr", "cz", "dk", "rs"], // Lounge Cup
  ["pt", "nl", "tr", "be", "at"], // Terminal Cup
  ["fr", "de", "it"], // Airport Cup
  ["es", "gb"], // Airport Champions League
];

function pickOpponent(tier: number, seed: number) {
  if (!isDbAvailable()) return null;
  const pool = TIER_POOLS[Math.max(0, Math.min(TIER_POOLS.length - 1, tier))];
  for (let attempt = 0; attempt < pool.length; attempt++) {
    const cc = pool[(seed + attempt) % pool.length];
    const leagues = getLeagues(cc);
    if (leagues.length === 0) continue;
    const league = leagues[0];
    const clubs = getClubs(cc, league.slug);
    if (clubs.length === 0) continue;
    const club = clubs[seed % clubs.length];
    const players = getPlayers(cc, league.slug, club.slug);
    const top = players.slice(0, 16);
    const ability = top.length > 0
      ? Math.round(top.reduce((s, p) => s + p.current_ability, 0) / top.length)
      : 100;
    return {
      name: club.name,
      country: getCountryByCode(cc)?.name ?? cc.toUpperCase(),
      league: league.name,
      ability,
      playerNames: top
        .filter((p) => !p.positions?.some((x) => x.code === "GK"))
        .slice(0, 8)
        .map((p) => `${p.first_name} ${p.last_name}`.trim()),
    };
  }
  return null;
}

export async function POST() {
  const state = readState();
  const derived = deriveClub(state.events, state.profile);
  const clubName = state.profile?.clubName ?? "Prompt Holiday FC";

  const seed = Math.floor(Date.now() / 1000) % 2_147_483_647;
  const opponent = pickOpponent(derived.leagueTier, seed) ?? {
    name: "Wanderers XI",
    country: "Neutral ground",
    league: "Friendly circuit",
    ability: 96,
    playerNames: [],
  };

  // Coaching staff give a small matchday edge — hiring pays off.
  const userAbility = squadStrength(derived) + Math.min(8, derived.staff.length * 2);

  const result = simulateMatch(
    {
      name: clubName,
      ability: userAbility,
      playerNames: derived.squad
        .filter((p) => p.position !== "GK")
        .sort((a, b) => b.ability - a.ability)
        .slice(0, 8)
        .map((p) => p.name),
    },
    { name: opponent.name, ability: opponent.ability, playerNames: opponent.playerNames },
    seed,
  );

  return NextResponse.json({
    result,
    opponent: {
      name: opponent.name,
      country: opponent.country,
      league: opponent.league,
      ability: opponent.ability,
    },
    user: {
      name: clubName,
      ability: userAbility,
      tier: derived.leagueTier,
      tierName: LEAGUES[derived.leagueTier],
      squadSize: derived.squad.length,
    },
  });
}
