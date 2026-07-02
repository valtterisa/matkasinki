# Discovery ★ — "Where is worth going?"

**The single most important feature.** The user has never been anywhere and does not
know what's worth their time. Discovery answers *where to go before how to plan it*.

## Job

Given the user's vibe (from onboarding), rough constraints (dates window, budget band,
max travel distance, must-haves/deal-breakers), produce a **short ranked list of
destinations**, each with:

- **Why it's worth it** — concrete, sourced reasons (not generic marketing).
- **Fit score** — how well it matches this user's vibe + budget + season.
- **When to go** — best window given weather/crowds/price for their dates.
- **Safety note** — real tourist-safety picture (scams, areas, advisories).
- **Confidence + sources** — links the Scout Agent actually read.

Then a one-tap **"Plan this"** hands the chosen destination to `trip-planner/`.

## How (agentic)

Discovery is a thin orchestrator over the **Scout Agent** (`src/agents/scout`):

```
constraints + vibe
   └─▶ Scout Agent: browse MULTIPLE sources → reconcile → rank
        - candidate destinations matching vibe/budget/season
        - cross-check safety + real tourist reviews
        - dedupe hype vs. substance
   └─▶ ranked DestinationCandidate[] with reasoning + citations
```

Accuracy is the priority: prefer multiple corroborating sources; surface uncertainty
rather than guessing.

## Low-effort by design

Introvert-friendly: the user should get a great shortlist from almost no input.
Sensible defaults from the vibe; refine by reacting (keep/skip/swap), not by typing.

## Contract

See `types.ts` for `DiscoveryQuery` and `DestinationCandidate`. Discovery emits no
football events itself — it feeds `trip-planner`, which is where real trips begin.
