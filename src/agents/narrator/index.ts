// Narrator Agent (§13) — turns an itinerary into TV-matchday commentary.
// SERVER-SIDE: calls Claude when ANTHROPIC_API_KEY is present; otherwise (or on
// any error) falls back to the deterministic template generator. Never crashes.
//
// Audio is produced in the browser via SpeechSynthesis (no key needed) — this
// module only writes the SCRIPT.

import { anthropic, MODELS } from "@/agents/shared/llm";
import {
  templateScript,
  templateIntro,
  templateOutro,
  type BroadcastSlide,
  type BroadcastMeta,
} from "./templates";

export type { BroadcastSlide, BroadcastMeta };

export interface BroadcastScript {
  intro: string;
  lines: string[]; // one per slide, same order
  outro: string;
  source: "claude" | "template";
}

export async function generateBroadcastScript(
  slides: BroadcastSlide[],
  meta: BroadcastMeta,
): Promise<BroadcastScript> {
  const fallback: BroadcastScript = {
    intro: templateIntro(meta),
    lines: templateScript(slides, meta),
    outro: templateOutro(meta),
    source: "template",
  };

  if (!process.env.ANTHROPIC_API_KEY) return fallback;

  try {
    const slideList = slides
      .map((s, i) => `${i + 1}. [Day ${s.day}] ${s.title}${s.sub ? ` — ${s.sub}` : ""}`)
      .join("\n");

    const res = await anthropic.messages.create({
      model: MODELS.interactive,
      max_tokens: 1800,
      temperature: 0.9,
      system:
        "You are a legendary football TV commentator narrating a travel itinerary as if it were a live matchday broadcast. Energetic, warm, witty — Peter Drury meets a travel show. Each line is spoken aloud by text-to-speech, so write flowing spoken prose: no markdown, no emoji, no stage directions.",
      messages: [
        {
          role: "user",
          content: `The manager of "${meta.clubName ?? "the club"}" is on a ${meta.totalDays}-day tour of ${meta.destination}. Narrate these itinerary stops as broadcast commentary.

Stops:
${slideList}

Return STRICT JSON only, no code fences:
{"intro": "<2-sentence broadcast welcome>", "lines": ["<2-3 sentence commentary for stop 1>", ...exactly ${slides.length} entries in order...], "outro": "<2-sentence full-time sign-off>"}

Each line must mention the stop by name, reference the day ("Day two, and..."), and land one football metaphor. Keep every line under 60 words.`,
        },
      ],
    });

    const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) return fallback;
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as {
      intro?: string;
      lines?: string[];
      outro?: string;
    };
    if (!Array.isArray(parsed.lines) || parsed.lines.length === 0) return fallback;

    // Pad/trim so the script always matches the slide count.
    const lines = slides.map((s, i) => parsed.lines?.[i] || fallback.lines[i]);
    return {
      intro: parsed.intro || fallback.intro,
      lines,
      outro: parsed.outro || fallback.outro,
      source: "claude",
    };
  } catch {
    return fallback;
  }
}

/**
 * Legacy-shaped helper kept for callers expecting the old stub signature.
 * Audio is synthesized client-side (SpeechSynthesis), so audioUrl stays empty.
 */
export async function narrateItinerary(itinerary: unknown): Promise<{
  slides: BroadcastSlide[];
  audioUrl: string;
}> {
  const slides = Array.isArray(itinerary)
    ? (itinerary as BroadcastSlide[]).filter((s) => s && typeof s.title === "string")
    : [];
  return { slides, audioUrl: "" };
}
