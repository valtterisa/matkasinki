# CLICK.md — Airport Cup, 5-minute demo

What to **click**. Pairs with [SPEECH.md](SPEECH.md) — same segment numbers.
Priorities: **P0 = never cut. Drop P2 first, then P1, if the clock goes red.**

---

## Pre-stage prep (do this BEFORE you present, ~2 min)

1. Start the app:
   - `npm run dev` → open `http://localhost:3000` (simplest), **or**
   - `npm run app` for the Electron desktop window (the "it's a real app" angle).
2. Complete the quiz once at `/onboarding` so a manager profile exists.
3. Go to `/budget` and **log one expense** — this makes the receipt option show
   up in the Verifier panel in §3.
4. **Un-mute your laptop.** §2 speaks out loud.
5. Open these tabs, left to right, in this order:
   `/discover` · `/broadcast` · `/guide` · `/away` · `/rivals`
6. Optional live-AI artifact: in a separate tab with a key set, pre-run
   `/discover` once so you can flash real live citations if asked.

> Timing targets per segment are in **(brackets)**. Total ≈ 5:00.

---

## ① Discovery + Scout Agent · P0 · (75s)

Tab: **`/discover`**

1. Click one **budget band** chip (e.g. 💳 Mid).
2. Pick a **travel month** from the dropdown.
3. Click **Find destinations →**. Ranked cards render (fit ring, safety badge,
   best-window, why-bullets, review quote, confidence bar).
4. On one card, click the **▸ N sources** disclosure to expand real URLs.
5. Click **Plan this →** on Porto or Kyoto (hands off to `/plan`).

> Fallback: if a search ever looks thin, click **🎲 Surprise me** — always full.

---

## ② Narrator broadcast · P0 · (75s)

Tab: **`/broadcast`** (loads the sample Porto itinerary automatically)

1. It **auto-plays**: scoreboard, LIVE clock, slides, spoken commentary.
2. Do nothing for 2–3 slides — let the audio carry the room.
3. If needed: **⏭** to skip ahead, **🔊** confirm unmuted, **⏸** to hold a slide.

> If there's no sound: the 🔇 icon means TTS is off/unavailable — click it once;
> captions in the "COMMENTARY" bar still tell the story.

---

## ③ Local Guide + Verifier Agent · P0 · (70s)

Tab: **`/guide`**

1. (Optional) toggle **🌱 Sustainability first** to reorder challenges.
2. On any challenge, click **Complete** to open the proof panel
   ("Prove it — need any 2 of 3").
3. **Show the rejection first:** click **Submit proof** with 0–1 proofs →
   ✗ rejected ("travel first, tap second").
4. Click **📍 Share location** (allow the browser prompt).
5. Click **📷 Upload photo** → pick any image.
6. Click **Submit proof** → **✓ Verified**, reward unlocked.

> The receipt dropdown (🧾) is populated only if you logged an expense in prep
> step 3. Geo + photo alone is enough — the receipt is a bonus to point at.

---

## ④ Architecture soundbite · P1 · (20s)

**No clicking.** Talk over the current screen (or the `/guide` verified badge).

---

## ⑤ Away mode · P1 · (35s)

Tab: **`/away`**

1. Click **Send away notice** → **✓ Away notice active** (real Resend send).
2. Scroll to **Inbox triage** — 6 emails sorted into Urgent / Can wait / FYI.
3. Scroll to **Home sitter** — device board + automation log.

> If you have your own inbox open on a second screen, glance at the email that
> just arrived for extra proof.

---

## ⑥ AI rival managers · P2 · (20s)

Tab: **`/rivals`** (or `/leagues`)

1. Point at the **four rival managers** — persona, club, squad strength.
2. Mention the numbers evolve by date. Done.

---

## Closing · P0

Return to **`/discover`** or **`/broadcast`** (best-looking screens) and deliver
the closing line from SPEECH.md.

---

## If the clock collapses to 3 minutes

Run only tabs **`/discover` → `/broadcast` → `/guide`**, then close.
Skip `/away` and `/rivals`.

## Quick recovery

- Any page looks empty → refresh; all pages self-seed with sample data.
- Discovery slow/thin → **🎲 Surprise me**.
- No broadcast audio → it's captions-only; keep narrating, don't stall.
