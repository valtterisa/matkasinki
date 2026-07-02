import type { DiscoveryQuery, DestinationCandidate } from "./types";
import { scoutDiscovery } from "@/agents/scout";
import { rankAtlas } from "@/agents/scout/atlas";

/**
 * Rank destinations worth visiting for a first-timer.
 * Thin orchestrator over the Scout Agent — see ./README.md.
 *
 * Guaranteed non-empty: the Scout falls back to a built-in atlas when no
 * ANTHROPIC_API_KEY is configured or live research fails, and this wrapper
 * adds one final safety net so callers never see an empty screen.
 */
export async function discoverDestinations(
  query: DiscoveryQuery,
): Promise<DestinationCandidate[]> {
  try {
    const ranked = await scoutDiscovery(query);
    if (ranked.length > 0) return ranked;
  } catch (err) {
    console.error("[discovery] scout failed unexpectedly:", err);
  }
  return rankAtlas(query);
}

export * from "./types";
