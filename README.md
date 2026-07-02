# Prompt Holiday

**A genuinely useful AI travel planner, wrapped in a football-manager game.**

The product is, first and foremost, a **travel planner**. Its most important job:
help someone decide **where is worth traveling — having never been there before** —
and then plan and track the whole trip. The football-manager layer (build a club from
real places you visit and challenges you complete) sits *on top* and must never
compromise the travel tool underneath.

## Product priority (top = most important)

1. **Discover** — where should I even go? (destination recommendation for a first-timer)
2. **Plan** — turn a chosen destination into a real, low-effort itinerary
3. **Do** — activities, packing, budget, local guide while traveling
4. **Away tools** — out-of-office, home sitter
5. **Play** — the football club / leagues / rivals layer built from real travel

## Stack

- **Next.js (App Router) + TypeScript** — demo UI and agent API in one deployable app.
- **Agents** — Claude-powered, web-research-capable (see `src/agents`).
- **Integrations** — Resend (email), weather, currency, geolocation, MCP (home sitter).
- **Football engine** — an external open-source engine behind an adapter (`src/lib/football-engine`), evaluated separately; the app never depends on its internals.

## Layout

- `src/app` — Next.js routes. `(travel)` group is primary; `(club)` group is the game layer.
- `src/features` — domain logic per feature, framework-light, ordered travel-first.
- `src/agents` — agentic AI: scout (research/discovery), verifier (anti-cheese), narrator.
- `src/lib` — third-party integrations and the football-engine adapter.
- `docs` — `BASE.md`, `FEATURES.md`, `ARCHITECTURE.md`.

See `docs/ARCHITECTURE.md` for how the travel core and football layer connect.

## Getting started

```bash
cp .env.example .env   # fill in keys (see FEATURES.md → Resend setup)
npm install
npm run dev
```
