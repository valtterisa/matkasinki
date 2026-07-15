"use client";

// Manager Induction — the ~60s vibe quiz demo hook.
// Deterministic client-side scoring (no LLM), CSS-only animation,
// result POSTed to /api/onboarding as the baseline preference profile.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  QUESTIONS,
  scoreQuiz,
  toProfile,
  type QuizResult,
} from "@/features/onboarding";

type Phase = "intro" | "quiz" | "crunching" | "reveal";

export default function OnboardingPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const result: QuizResult | null = useMemo(
    () => (phase === "reveal" ? scoreQuiz(answers) : null),
    [phase, answers],
  );

  // Persist the profile once the reveal is computed.
  useEffect(() => {
    if (!result) return;
    setSaveState("saving");
    fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toProfile(result)),
    })
      .then((r) => setSaveState(r.ok ? "saved" : "error"))
      .catch(() => setSaveState("error"));
  }, [result]);

  function pick(optionIdx: number) {
    if (picked !== null) return; // lock while transitioning
    setPicked(optionIdx);
    const nextAnswers = [...answers, optionIdx];
    timers.current.push(
      setTimeout(() => {
        setAnswers(nextAnswers);
        setPicked(null);
        if (nextAnswers.length >= QUESTIONS.length) {
          setPhase("crunching");
          timers.current.push(setTimeout(() => setPhase("reveal"), 900));
        } else {
          setStep(nextAnswers.length);
        }
      }, 320),
    );
  }

  function restart() {
    setPhase("quiz");
    setStep(0);
    setAnswers([]);
    setPicked(null);
    setSaveState("idle");
  }

  const q = QUESTIONS[step];
  const progress =
    phase === "quiz" ? (answers.length + (picked !== null ? 1 : 0)) / QUESTIONS.length : 1;

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <style>{css}</style>

        {phase === "intro" && (
          <section className="stack" style={{ textAlign: "center", paddingTop: 24 }}>
            <div className="rise rise-1">
              <span className="badge badge--accent">Manager Induction</span>
            </div>
            <h1 className="rise rise-2" style={{ marginBottom: 0 }}>
              Welcome to the dugout.
            </h1>
            <p className="muted rise rise-3" style={{ maxWidth: 520, margin: "0 auto" }}>
              Before we scout the planet for you, the board needs your travel DNA.
              Five questions. No typing. Sixty seconds. Then you get a club.
            </p>
            <div className="rise rise-4">
              <button className="btn btn--lg glow" onClick={() => setPhase("quiz")}>
                Start the induction ⚽
              </button>
            </div>
            <p className="muted rise rise-4" style={{ fontSize: "0.8rem" }}>
              Tap fast — the transfer window is closing.
            </p>
          </section>
        )}

        {phase === "quiz" && (
          <section className="stack">
            <div className="spread rise">
              <span className="badge badge--accent">{q.kicker}</span>
              <span className="muted" style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem" }}>
                {step + 1} / {QUESTIONS.length}
              </span>
            </div>

            <div className="ob-progress rise">
              <div className="ob-progress__fill" style={{ width: `${progress * 100}%` }} />
            </div>

            {/* key on step re-runs entrance animations per question */}
            <div key={q.id} className="stack">
              <h2 className="rise rise-1" style={{ marginBottom: 4 }}>
                {q.prompt}
              </h2>
              <div className="stack" style={{ gap: "var(--space-3)" }}>
                {q.options.map((opt, i) => (
                  <button
                    key={opt.id}
                    onClick={() => pick(i)}
                    className={`card card--interactive ob-option rise rise-${Math.min(i + 1, 4)} ${
                      picked === i ? "ob-option--picked" : ""
                    } ${picked !== null && picked !== i ? "ob-option--dimmed" : ""}`}
                  >
                    <span className="ob-option__emoji">{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {phase === "crunching" && (
          <section className="stack" style={{ textAlign: "center", paddingTop: 80 }}>
            <div className="ob-spinner rise" aria-hidden>
              ⚽
            </div>
            <h2 className="rise rise-1">Crunching the scouting report…</h2>
            <p className="muted rise rise-2">The board is arguing about your formation.</p>
          </section>
        )}

        {phase === "reveal" && result && <Reveal result={result} saveState={saveState} onRestart={restart} />}
      </div>
    </main>
  );
}

function Reveal({
  result,
  saveState,
  onRestart,
}: {
  result: QuizResult;
  saveState: "idle" | "saving" | "saved" | "error";
  onRestart: () => void;
}) {
  const { archetype } = result;
  const { club } = archetype;
  const [c1, c2] = club.colors;
  const initials = club.clubName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <section className="stack" style={{ textAlign: "center" }}>
      {/* CSS confetti in the kit colors */}
      <div className="ob-confetti" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 7.3 + 4) % 100}%`,
              background: i % 2 ? c1 : c2,
              animationDelay: `${(i % 7) * 0.12}s`,
              animationDuration: `${2.2 + (i % 5) * 0.35}s`,
            }}
          />
        ))}
      </div>

      <div className="rise rise-1">
        <span className="badge badge--amber">Induction complete</span>
      </div>

      <h1 className="rise rise-2" style={{ marginBottom: 0 }}>
        {archetype.emoji} {archetype.label}
      </h1>
      <p className="muted rise rise-2" style={{ marginBottom: 8 }}>
        {archetype.tagline}
      </p>

      {/* Crest card */}
      <div className="rise rise-3" style={{ display: "flex", justifyContent: "center" }}>
        <div className="card glow ob-crest-card">
          <div
            className="ob-crest"
            style={{
              background: `linear-gradient(105deg, ${c1} 0 33%, ${c2} 33% 66%, ${c1} 66% 100%)`,
            }}
          >
            <span className="ob-crest__initials">{initials}</span>
            <span className="ob-crest__star" style={{ color: c2 }}>
              ★
            </span>
          </div>
          <h2 style={{ margin: "18px 0 2px" }}>{club.clubName}</h2>
          <div className="row" style={{ justifyContent: "center" }}>
            <span className="badge badge--accent">Formation {club.formation}</span>
            <span className="badge">
              Kit{" "}
              <i className="ob-swatch" style={{ background: c1 }} />
              <i className="ob-swatch" style={{ background: c2 }} />
            </span>
          </div>
          <p className="muted" style={{ margin: "14px 0 0", fontSize: "0.95rem" }}>
            {club.flavor}
          </p>
        </div>
      </div>

      <div className="rise rise-4 stack" style={{ alignItems: "center", gap: "var(--space-3)" }}>
        <Link href="/discover" className="btn btn--lg btn--amber" style={{ textDecoration: "none" }}>
          Find where&apos;s worth going →
        </Link>
        <div className="row" style={{ justifyContent: "center" }}>
          <button className="btn btn--ghost" onClick={onRestart}>
            Retake induction
          </button>
          <span className="muted" style={{ fontSize: "0.78rem" }}>
            {saveState === "saving" && "Filing your profile with the board…"}
            {saveState === "saved" && "Profile saved — the scouts have your vibe."}
            {saveState === "error" && "Couldn't save the profile — the fax machine jammed. Your result still stands."}
          </span>
        </div>
      </div>
    </section>
  );
}

const css = `
.ob-progress {
  height: 6px; border-radius: 999px; background: var(--bg-overlay);
  border: 1px solid var(--line); overflow: hidden;
}
.ob-progress__fill {
  height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transition: width 0.35s cubic-bezier(0.2, 0.7, 0.3, 1);
}

.ob-option {
  display: flex; align-items: center; gap: 14px; width: 100%;
  text-align: left; font: inherit; color: var(--fg);
  font-size: 1rem; line-height: 1.4; padding: 16px 18px;
}
.ob-option__emoji { font-size: 1.5rem; line-height: 1; flex: none; }
.ob-option--picked {
  border-color: var(--accent); animation: ob-pop 0.32s ease both;
  background: linear-gradient(90deg, rgba(52, 211, 153, 0.14), var(--bg-raised));
}
.ob-option--dimmed { opacity: 0.35; pointer-events: none; }
@keyframes ob-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.025); }
  100% { transform: scale(1.005); }
}

.ob-spinner { font-size: 3rem; animation: ob-roll 0.9s linear infinite; }
@keyframes ob-roll { to { transform: rotate(360deg); } }

.ob-crest-card { max-width: 420px; padding: var(--space-6); }
.ob-crest {
  width: 150px; height: 168px; margin: 0 auto; position: relative;
  clip-path: polygon(50% 100%, 6% 78%, 0 0, 100% 0, 94% 78%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: inset 0 0 0 5px rgba(11, 14, 20, 0.55);
  animation: ob-crest-in 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.2) both 0.25s;
}
@keyframes ob-crest-in {
  from { opacity: 0; transform: scale(0.4) rotate(-10deg); }
  to { opacity: 1; transform: scale(1) rotate(0deg); }
}
.ob-crest__initials {
  font-family: var(--font-display); font-weight: 700; font-size: 2.1rem;
  color: #0b0e14; letter-spacing: 0.02em;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
}
.ob-crest__star {
  position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
  font-size: 1rem; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.4));
}
.ob-swatch {
  display: inline-block; width: 10px; height: 10px; border-radius: 3px;
  margin-left: 5px; vertical-align: middle; border: 1px solid rgba(255,255,255,0.25);
}

.ob-confetti { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 10; }
.ob-confetti i {
  position: absolute; top: -14px; width: 9px; height: 14px; border-radius: 2px;
  opacity: 0; animation-name: ob-fall; animation-timing-function: ease-in;
  animation-fill-mode: forwards;
}
@keyframes ob-fall {
  0% { opacity: 1; transform: translateY(0) rotate(0deg); }
  100% { opacity: 0; transform: translateY(105vh) rotate(540deg); }
}
`;
