# Features (ordered travel-first)

Each folder is a self-contained travel tool. **The football/game folders come last
and only consume events from the travel tools — never the reverse.**

## Travel core (the actual product)

1. `discovery/` ★ — **Where is worth going, never having been there?** The primary
   entry point. Ranks destinations for a first-timer with "why it's worth it" reasoning.
2. `trip-planner/` — chosen destination → real, low-effort itinerary (introvert-friendly).
3. `activity-finder/` — daily plans from weather + location + mood; difficulty-scaled.
4. `packing-list/` — real dynamic packing list from live conditions at the trip dates.
5. `budget-tracker/` — real expense logging + currency conversion.
6. `local-guide/` — live, web-sourced local challenges (safe, reviewed, in-budget).
7. `out-of-office/` — real away auto-reply/triage/summary (Resend email).
8. `reading-curator/` — reading list from the vibe quiz.
9. `home-sitter/` — home automation while away (MCP).
10. `onboarding/` — fast, fun vibe quiz (demo hook).

## Game layer (built on top)

- `club/` — team building, `leagues/`, `rivals/`, `narrative/`.
  Consumes verified `TravelEvent`s only.
