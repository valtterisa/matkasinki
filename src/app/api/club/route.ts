// GET /api/club — the derived club state (§16).
// Recomputes from the travel event log on every read (pure derivation), then
// caches the summary into store.club so other features can read it cheaply.

import { NextResponse } from "next/server";
import { readState, updateState } from "@/lib/store";
import { deriveClub, squadStrength } from "@/features/club/derive";
import { LEAGUES, progressToNextTier } from "@/features/club";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = readState();
  const derived = deriveClub(state.events, state.profile);

  // Cache the derived summary back into the store (read-time recompute is the
  // source of truth; this is just a convenience snapshot for other features).
  updateState((s) => {
    s.club = {
      squad: derived.squad,
      staff: derived.staff,
      leagueTier: derived.leagueTier,
      transferBudget: derived.transferBudget,
      morale: derived.morale,
    };
  });

  return NextResponse.json({
    club: derived,
    profile: state.profile ?? null,
    league: LEAGUES[derived.leagueTier],
    progress: progressToNextTier(derived.verifiedChallenges),
    squadStrength: squadStrength(derived),
  });
}
