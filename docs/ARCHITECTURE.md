# Architecture

## Principle: travel tool first, game layer second

Two layers, one-directional dependency:

```
  TRAVEL CORE  ──emits verified real-world events──▶  FOOTBALL LAYER
 (works alone)                                       (built on top)
```

- The **travel core** is fully usable with the game turned off. Every module
  (Discover, Plan, Activities, Packing, Budget, Guide, Out-of-Office) is a real tool.
- The **football layer** only *consumes* verified events (challenge completed, place
  visited, budget kept). It never feeds back into or gates the travel tools.

## The critical path: "where is worth going?"

`Discover` is the entry point and the hardest problem: the user knows nothing about
any destination. Flow:

```
onboarding vibe  ─▶  Discovery module  ─▶  Scout Agent (deep web research)
                          │                     │  multi-source, safety, reviews,
                          │                     │  season/weather, budget-fit
                          ▼                     ▼
                 ranked destinations WITH "why it's worth it" reasoning
                          │
                          ▼
                    Trip Planner (chosen destination → itinerary)
```

The Scout Agent is shared: it powers both **Discovery** (which city/country) and the
**Local Guide** (which specific challenges once you're there).

## Event contract (travel → football)

The travel core emits typed events; the football layer subscribes.

```ts
type TravelEvent =
  | { kind: "place_visited"; placeId: string; verified: boolean }
  | { kind: "challenge_completed"; challengeId: string; proof: Proof }
  | { kind: "budget_kept"; tripId: string; underBy: number }
  | { kind: "activity_done"; activityId: string };
```

`verified`/`proof` come from the **Verifier Agent** (geo/photo/receipt). The football
layer must ignore unverified events for high-value rewards (anti-cheese).

## Agents

- **Scout** — destination discovery + local challenge generation via web research.
- **Verifier** — confirms real-world completion; gatekeeps rewards.
- **Narrator** — turns an itinerary into a TV/matchday slideshow + audio narration.

## Football engine boundary

The open-source engine (candidates: ZOXEXIVO/open-football, openfootmanager) lives
behind `src/lib/football-engine/adapter.ts`. The app talks to that interface only, so
we can swap engines or run one headless as a service without touching feature code.
