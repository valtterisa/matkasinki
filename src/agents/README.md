# Agents

Agentic AI. All use the shared Claude client in `shared/`.

- **scout/** — the workhorse. Deep, multi-source web research. Two modes:
  - `discovery` — which destination is worth visiting (safety + reviews + fit).
  - `local` — which specific challenges to do once there.
  Accuracy-first: browse multiple sources, reconcile conflicts, cite what it read.
- **verifier/** — confirms a challenge/visit actually happened (geo/photo/receipt)
  before the football layer grants high-value rewards. Anti-cheese gatekeeper.
- **narrator/** — turns an itinerary into a TV/matchday-style slideshow + spoken
  narration.

Model note: default to a fast Claude model for interactive flows; the scout may use a
more capable model for heavy research. Configure in `shared/llm.ts`.
