# SPEECH.md — Airport Cup · full presentation script

Word-for-word script for the 5-minute stage demo. Pairs with [CLICK.md](CLICK.md)
— same segment numbers. Deliver the **quoted lines**; the *italic notes* are
stage directions, not spoken.

### Delivery notes
- **Energy high, pace brisk.** ~135 words/min. Smile on the opening and the close.
- **Land the pauses.** The two biggest moments — the Narrator talking (§2) and
  the rejection flipping to Verified (§3) — work only if you *stop talking* and
  let the app perform.
- **One honesty beat** (in §1): say it once, casually, then move on. Judges trust
  a builder who's straight about what's live vs. cached.
- **Priorities:** P0 = never cut. If the clock goes red, drop §6, then §5, then §4.
- `[CUT IF SHORT]` lines are optional polish — say them only if you're on pace.

---

## COLD OPEN — the hook · (~25s)

*Stand on the `/onboarding` reveal screen (club crest + kit colours showing).*

> "Everybody here has felt this: a week off, some money saved… and absolutely no
> idea where to actually go. Airport Cup fixes that — it's a genuinely useful AI
> travel planner, and it's wrapped in a football-manager game you build from
> **real trips you actually take.**"

*Gesture at the crest.*

> "It starts in sixty seconds. You answer five quick questions — no typing —
> and the board hands you a club: your kit, your formation, your travel DNA.
> That profile quietly powers **every** recommendation from here on. But that's
> the warm-up. Let me show you the engine."

> `[CUT IF SHORT]` "This whole thing? Four AI agents and one real holiday."

---

## ① Discovery + Scout Agent — the core · P0 · (70s)

*Switch to `/discover`. Click a budget chip + a month → **Find destinations**.*

> "This is the hardest problem in travel: *where's even worth going* when
> you've never been anywhere? Meet the **Scout agent** — Claude with live web
> search."

*Cards render. Sweep a hand across them.*

> "It doesn't hand you a listicle. It reads **multiple sources**, weighs real
> tourist reviews against **actual safety advisories**, and when the sources
> disagree, watch this —" *(tap the confidence bar)* "— it **lowers its own
> confidence instead of bluffing.** Every reason here is cited."

*Expand the sources on one card.*

> "Those are the real URLs it read. Not marketing — receipts."

*The honesty beat — casual, then move on.*

> "In production Scout runs that search live. On stage I'm running its
> deterministic scouting cache so we never wait on a network — same agent, same
> output, zero risk."

*Click **Plan this →** (lands on `/plan`).*

> "I like Porto. One tap — and the **Trip Planner** turns a destination into a
> real, day-by-day itinerary with smart defaults, so a lazy traveller gets a
> complete plan in seconds. This is a real travel tool. Now here's where it
> becomes something you've never seen."

---

## ② Narrator broadcast — the showpiece · P0 · (75s)

**Turn the laptop volume UP before you switch tabs.**

*Switch to `/broadcast`. It auto-plays: scoreboard, LIVE clock, spoken commentary.*

> "Your itinerary… as a live matchday broadcast."

*STOP TALKING. Let it commentate for two or three full slides. Let the room hear
the voice. This silence is the demo — don't step on it.*

*After a beat, ride the energy back in:*

> "That's the **Narrator agent** — it writes the commentary and speaks your
> holiday out loud. Peter Drury meets a travel show. This is the moment the real
> trip and the game stop being two things and become **one.**"

> `[CUT IF SHORT]` "Scoreboard, match clock, lower-third captions — it's a
> broadcast of a trip that doesn't exist yet, for a club you built ninety
> seconds ago."

---

## ③ Local Guide + Verifier Agent — the anti-cheese loop · P0 · (70s)

*Switch to `/guide`. Open a challenge → the "need any 2 of 3" proof panel.*

> "Once you're there, the Scout agent flips to local mode and generates **sourced
> challenges** — hidden gems, local dishes, the real stuff. Complete them and you
> unlock players, staff, whole leagues. So the obvious question is: what stops me
> faking it from my couch?"

*Click **Submit proof** with nothing / one proof → ✗ REJECTED.*

> "This. Rejected. The **Verifier agent** is the gatekeeper, and it does not
> care that you tapped a button."

*Now add **📍 location** + **📷 photo** → **Submit** → ✓ Verified.*

> "It demands **two independent proofs** — geolocation, a photo, or a matching
> receipt from your budget tracker. *Now* — verified. Reward unlocked."

*Beat. Land it.*

> "Which means climbing this league isn't grinding. It **literally requires
> getting on a plane and doing the thing.** The game is powered by your real
> life — and it can't be cheated."

---

## ④ The architecture — no clicking · P1 · (20s)

*Talk over the verified screen. This is your credibility line for the engineers.*

> "Underneath, there's one clean rule. The travel core emits typed events —
> *place visited, challenge completed, budget kept* — each flagged verified or
> not. The football layer can **only** consume the verified ones. One direction.
> Which is why every travel tool here works perfectly with the game switched
> completely off."

---

## ⑤ Away mode — real email + triage + Home-Sitter MCP · P1 · (35s)

*Switch to `/away`. Click **Send away notice**.*

> "And when you finally go — being away is **rewarded**, not punished. This
> out-of-office just fired for real, through Resend. Not a mock — a real email."

*Scroll to the triage board, then the home-sitter log.*

> "A triage agent guards your inbox while you're gone — urgent, can-wait, FYI,
> each with a reason. And a home-sitter agent runs your actual house over **MCP**
> — lights, heating, security — logging every action. You switch off; the agents
> don't."

---

## ⑥ AI rival managers — the living league · P2 · (20s)

*Switch to `/rivals`.*

> "And you're not climbing alone. **Four AI rival managers**, each with a
> personality, each pulled from a real football database — out there 'travelling'
> and gaining ground on you **every single day**, whether you open the app or
> not. The league is alive."

---

## CLOSE — memorize this, deliver it to the room · P0 · (~20s)

*Return to `/broadcast` or `/discover` — whichever's still glowing. Eye contact.*

> "So — **Scout** finds where's worth going. The **Planner** builds the trip.
> The **Narrator** broadcasts it. The **Verifier** proves you actually went. And
> a whole football club grows out of the places you've really been."

*Pause. Then, slower:*

> "Four agents. One real trip. **That's Airport Cup — and I'd love your vote.**"

---

## Flex plan

- **On for 6–7 min?** Add every `[CUT IF SHORT]` line and do the onboarding quiz
  *live* instead of pre-completed.
- **Down to 3 min?** Run only **① Discovery → ② Broadcast → ③ Verifier**, then
  jump straight to the CLOSE. That trio alone tells the whole story: find it →
  broadcast it → prove you went.
- **If anything stalls:** don't apologise or freeze — say *"the scouts are
  thinking"* and hit refresh / **🎲 Surprise me**. Every page self-seeds; you're
  never one bug away from dead air.
