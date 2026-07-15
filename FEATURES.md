# Prompt Holiday — Build Specification (FEATURES.md)

**A genuinely useful AI travel planner, wrapped in a football-manager game.**

This document is the single source of truth for building the app. It is detailed enough
to implement directly.

> **Golden rule:** it is a **travel planner first**. Every travel feature must work as a
> real-life tool on its own; the football-manager gamification is layered *on top* and
> must never gate or degrade the travel tools. The product's most important job is to
> help someone **decide where is worth traveling — having never been there before** —
> then plan, do, and track the trip.

---

## 0. Tech stack & global conventions

- **Framework:** Next.js (App Router) + TypeScript.
- **AI:** Claude via `@anthropic-ai/sdk`. Fast model (`claude-sonnet-5`) for interactive
  flows; capable model (`claude-opus-4-8`) for deep research (Scout Agent).
- **Web research:** agents must use a real web-search/browse tool, read **multiple
  sources**, reconcile conflicts, and cite URLs.
- **Integrations:** Resend (email), a weather API, a currency API, geolocation/geocoding,
  MCP (home sitter demo).
- **Data direction:** travel core → emits verified events → football layer. One-way only.
- **Secrets:** via `.env` (git-ignored); never commit keys. See `.env.example`.

### Project structure (already scaffolded)

```
src/app/           Next.js routes — (travel) primary, (club) secondary, / -> /discover
src/features/      domain logic, travel-first: discovery ★, trip-planner, activity-finder,
                   packing-list, budget-tracker, local-guide, out-of-office,
                   reading-curator, home-sitter, onboarding, club/{rivals,...}
src/agents/        scout (discovery + local research), verifier (anti-cheese), narrator
src/lib/           resend, weather, currency, geo, football-engine/adapter
docs/              BASE.md, ARCHITECTURE.md
```

---

## 1. Design & UI (must-have, applies to the whole app)

The interface must feel **sleek, sharp, and modern** — this is a graded/demo priority,
not an afterthought.

- **Typography:** use a **modern, distinctive typeface — NOT the browser/OS default**
  (no plain Arial/Times/system-ui as the primary face). Choose a contemporary font
  (e.g. a geometric or grotesque sans such as *Inter*, *Geist*, *Satoshi*, *General
  Sans*, *Space Grotesk*, or a modern serif for display). Load it properly
  (`next/font`), set it as the base font, and pair one display face with one body face.
- **Visual language:** clean, high-contrast, generous whitespace, crisp edges, a tight
  and consistent spacing scale, subtle depth (soft shadows / layering), rounded-but-sharp
  corners. No cluttered, dated, or "default Bootstrap" look.
- **Motion:** smooth, purposeful micro-interactions and transitions (hover, swipe,
  reveal). Keep it fast — never janky.
- **Consistency:** a small design-token system (colors, spacing, radius, typography)
  applied across every screen. Dark mode encouraged.
- **Responsive:** works well on a laptop for the demo and on mobile.
- **The two demo showpieces** — the onboarding vibe quiz and the Narrator broadcast —
  must look especially polished.

---

## 2. Onboarding — "Manager Induction" (demo-critical)

The first-run experience must be **fun and fast** — it is the demo hook and there are
only a few minutes on stage.

- **Short personality / vibe quiz:** a handful of multiple-choice questions determining a
  travel **vibe archetype** (e.g. Explorer, Foodie, Beach-lounger, Culture-seeker,
  Adrenaline).
- **Completable live in ~60 seconds.** Snappy, animated, playful.
- **Result reveal:** maps the vibe to a starting **club identity** — kit colours,
  formation/playstyle, squad flavour (e.g. "You're a 4-3-3 Foodie counter-attacker").
- **Output** feeds every downstream feature (Discovery, Trip Planner, Activity Finder,
  Scout) as the baseline preference profile.
- **Acceptance:** a first-time user reaches a personalized result in under a minute
  without typing free text.

---

## 3. Discovery ★ — "Where is worth going?" (the primary feature)

The most important feature and the app's landing screen (`/` → `/discover`). The user
has never been anywhere and doesn't know what's worth their time.

- **Inputs (low-effort):** vibe (from onboarding) + loose constraints — dates window,
  budget band, max travel time, origin, must-haves, deal-breakers. Great results from
  almost no input; refine by **reacting (keep/skip/swap)**, not typing.
- **Engine:** thin orchestrator over the **Scout Agent** in `discovery` mode.
- **Output — a short ranked list of destinations**, each with:
  - **Why it's worth it** — concrete, sourced reasons (not marketing fluff).
  - **Fit score** (0–1) vs. vibe + budget + season.
  - **Best window** to go (weather/crowds/price for their dates).
  - **Safety note** — real tourist-safety picture (scams, areas, advisories).
  - **Review summary** — distilled from real tourist reviews.
  - **Confidence** (0–1) + **sources** (URLs actually read).
- **Handoff:** one-tap **"Plan this"** sends the chosen destination to Trip Planner.
- **Acceptance:** for a first-timer with minimal input, returns ≥3 credible destinations
  with reasons and citations; safety and reviews are reflected in the ranking.

---

## 4. Trip Planner (core: a real itinerary tool)

Must remain, at its core, an **actual trip planner**. Only after a real itinerary exists
is the output mapped to a football season.

- **Inputs:** destination (from Discovery), dates, budget, vibe → detailed, day-by-day
  itinerary.
- **Low-effort / introvert-friendly design (primary requirement):**
  - Smart defaults inferred from the vibe so a plan generates with almost no input.
  - Progressive disclosure: one-tap choices, sliders, "surprise me" — not long forms.
  - AI proposes a full plan first; the user **reacts** (swipe keep/skip/swap).
  - "Good enough" fast path: usable itinerary from just destination + dates + budget.
- **Output:** a real, followable itinerary — **then** mapped to the club (training camps,
  fixtures, transfer budget).
- **Acceptance:** a lazy user gets a complete, sensible multi-day itinerary in a few taps.

---

## 5. Activity Finder (core: daily plans, difficulty-scaled)

- **Inputs:** weather + location + mood → plans for the day.
- **Difficulty setting** (chill / standard / adventurous / hardcore): scales activities;
  harder difficulty spawns **more and richer challenges**.
- **Itinerary-consistent:** activities and spawned challenges fit where the user actually
  is and what they've planned.
- **Gamification:** each completed activity = a training session / fitness & morale boost.
- **Acceptance:** given today's real weather + location, returns a coherent day plan whose
  intensity matches the difficulty setting.

---

## 6. Packing List (core: real dynamic generator)

- **Inputs:** destination + weather + trip type → what to bring.
- **Real dynamic generation:** pulls the **real-life conditions at the correct dates and
  location** to build the actual list; **updates daily** as forecasts/plans change.
- **Gamification:** completing the checklist unlocks club kit / match-day readiness bonus
  — but the list is fully useful with the game off.
- **Acceptance:** the list reflects the true forecast for the trip window and adapts when
  the forecast changes.

---

## 7. Budget Tracker (core: real budgeting tool)

- **Real tool first:** log expenses, convert currencies easily, track spend across the
  trip.
- **Gamification:** staying under budget → sponsorship bonus / transfer funds; club
  finances mirror the trip budget 1:1.
- **Acceptance:** accurate multi-currency expense log and totals usable without any game
  features. Receipts here also feed the Verifier (anti-cheese).

---

## 8. Local Guide + Challenges (IMPORTANT — heart of the real-world → club loop)

Assume the user **knows nothing** about the destination.

- **Agentically generated:** challenges are **suggested by live web search** (restaurants,
  hidden gems, landmarks, local dishes) via the Scout Agent — not a static list.
- **Verified completion (no cheesing):** the user **cannot** just tap "Done" without
  traveling. Verification uses **geolocation, photo check, and/or a matching Budget
  Tracker receipt** before any reward is granted (see Verifier Agent).
- **Rewards unlock real progression:**
  - New **leagues** (see §14).
  - **Friendly club fixtures.**
  - **Players** scouted from specific facilities/venues (region-flavoured).
  - **Coaching staff and other club staff** (physios, scouts, analysts, board) added to
    the in-app team.
- **Sustainability by default:** challenges favour low-impact, local, sustainable options
  **by default**; the user can **turn this off in settings**.
- **Budget-aware:** challenges respect the trip budget.
- **Acceptance:** for an unfamiliar city, produces safe, reviewed, in-budget challenges
  with sources; rewards only apply after verified completion.

---

## 9. Out-of-Office (core: real away tool, Resend demo)

- **Real tool first:** auto-reply, triage, and summarise incoming mail while away.
- **Resend integration:** sends a default **"I'm away"** email to
  `dangvuhaidang@gmail.com` (configurable via `OOO_DEFAULT_TO`). See **§16 Resend setup**.
- **Gamification:** "Manager on tour" — while genuinely away, the club auto-plays
  low-stakes fixtures; the agent summarises results on return. Being away is rewarded.
- **Acceptance:** with a valid Resend key, one action sends a well-formatted away email to
  the target address.

---

## 10. Reading Curator

- Suggests a reading list from the vibe-quiz results.
- **Gamification:** finishing recommended reading grants **manager XP** → unlocks
  tactics/formations/staff. Keeps the app engaging **between** trips.

---

## 11. Home Sitter

- Runs home automation while the user is away — **demoed via an MCP server**.
- **Gamification:** fits "Manager on tour" (estate looked after while you scout).

---

## 12. Scout Agent (deep, accurate web research)

The workhorse agent; powers both Discovery (which destination) and Local Guide (which
challenges).

- **Uses the Internet well:** browses and cross-references **multiple sources**, not one.
- **Accuracy-first:** reconciles conflicting info; surfaces uncertainty rather than
  guessing; **cites** what it read.
- **Safety-aware:** accounts for **actual tourist safety** (neighbourhoods, scams,
  advisories).
- **Reputation-aware:** weighs **previous tourist reviews** so recommendations are vetted.
- Reasons about difficulty, weather, budget, and user history.

---

## 13. Narrator Agent — Matchday Travel Broadcast (demo showpiece)

- Turns a generated itinerary into a **matchday-style, TV-style slideshow**.
- **Aural narration:** narrates the itinerary **out loud** in a sports-broadcast/
  commentary style (text-to-speech).
- Fuses the real trip (places, meals, weather) with the football framing into one
  experience.
- **Acceptance:** given an itinerary, renders an auto-advancing slideshow with synced
  spoken narration; looks polished for the demo.

---

## 14. Leagues — the touristy cup ladder

Real-life national leagues map to travel-themed tiers, in **increasing** prestige. The
**top two are Airport Cup and Airport Champions League.** (Names tunable; keep the
escalating-airport-journey theme.)

1. **Check-In Cup** — entry tier.
2. **Lounge Cup** — regional / early progression.
3. **Terminal Cup** — mid tier.
4. **Airport Cup** — elite domestic tier (one of the two biggest).
5. **Airport Champions League (ACL)** — the pinnacle, continental/global (the biggest).

Progression is unlocked by completing **verified** real-world challenges (§8), so climbing
the ladder literally requires traveling and doing things.

---

## 15. Rival Managers & Multiplayer

- **AI rival-manager agents:** opposing clubs that "travel" narratively; provide
  single-player competition and leaderboards tied to real exploration.
- **Invite friends to compete:** users can invite friends to play head-to-head.
- **Accounts required** for multiplayer/social (auth + profiles + shared/co-op clubs so a
  group holiday becomes a coordinated recruitment drive).

---

## 16. Cross-cutting: verification & anti-cheese

- High-value rewards require the **Verifier Agent's** sign-off (geo / photo / receipt).
- Cap same-location farming; distant/new destinations yield rarer rewards to nudge genuine
  holidays over trivial check-ins.
- **Streak/decay:** club form and facilities gently decay without travel, encouraging the
  next real trip.

### Event contract (travel → football)

```ts
type TravelEvent =
  | { kind: "place_visited"; placeId: string; verified: boolean }
  | { kind: "challenge_completed"; challengeId: string; verified: boolean }
  | { kind: "budget_kept"; tripId: string; underBy: number }
  | { kind: "activity_done"; activityId: string };
```

The football layer must ignore unverified events for high-value rewards.

---

## 17. Football engine boundary

The open-source engine (candidates: **ZOXEXIVO/open-football**, **openfootmanager**) lives
behind `src/lib/football-engine/adapter.ts`. App code talks to that interface only, so the
engine can be swapped or run headless as a service without touching feature code. **Check
each repo's license** before integrating (Openfoot is GPLv3 — copyleft).

---

## 18. Resend setup (Out-of-Office email)

To enable the "I'm away" email to `dangvuhaidang@gmail.com`:

1. Create an account at [resend.com](https://resend.com) → **API Keys** → Create.
2. **Do not paste the key into code or the repo.** Put it in git-ignored `.env`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
   OOO_DEFAULT_TO=dangvuhaidang@gmail.com
   ```
3. For real delivery Resend needs a **verified sender domain** — *or* use their
   onboarding/sandbox domain, which can only send to your own verified address
   (`dangvuhaidang@gmail.com`), which is exactly the demo case.
4. Once the key is in `.env`, the Out-of-Office send call can be wired up.

---

## 19. Suggested build order (for the next prompt)

1. **Design system + fonts + app shell** (§1) — tokens, modern typeface, layout, dark mode.
2. **Onboarding vibe quiz** (§2) — demo hook.
3. **Discovery + Scout Agent** (§3, §12) — the core "where to go" vertical slice.
4. **Trip Planner** (§4) — low-effort itinerary from a chosen destination.
5. **Narrator broadcast** (§13) — demo showpiece over a planned itinerary.
6. **Supporting travel tools** — Activity Finder, Packing, Budget, Local Guide (§5–8).
7. **Out-of-Office + Resend** (§9, §18).
8. **Football layer** — club, leagues, verification, rivals/accounts (§8, §14–17).
