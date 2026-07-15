# Routes

Travel is the product; the game is a section within it.

```
/                      -> redirects to /discover (the real starting question)
/onboarding            -> vibe quiz (demo hook)

(travel) — primary
  /discover            ★ where is worth going?  (Discovery + Scout)
  /plan                trip planner (from a chosen destination)
  /activities          activity finder (difficulty-scaled)
  /packing             packing list (real forecast-driven)
  /budget              budget tracker (real FX rates)
  /guide               local guide + verified challenges
  /away                out-of-office (Resend) + home sitter
  /reading             reading curator
  /broadcast           narrator matchday TV broadcast of the itinerary

(club) — game layer, secondary
  /club                your team (players + coaching/club staff from real DB data)
  /leagues             Check-In -> Lounge -> Terminal -> Airport Cup -> ACL
  /rivals              AI rivals + friend invites

/api/*                 agent + integration endpoints
```

`(travel)` and `(club)` are Next.js route groups: the travel group is the default
experience; the club group is opt-in and reachable but never blocks travel tools.
