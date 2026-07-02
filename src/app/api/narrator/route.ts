// POST /api/narrator — broadcast commentary script for the /broadcast showpiece.
// Body: { slides: BroadcastSlide[], meta: BroadcastMeta }
// Uses Claude when ANTHROPIC_API_KEY is set; otherwise the deterministic
// template generator. Always returns a usable script — never 500s the demo.

import { NextResponse } from "next/server";
import {
  generateBroadcastScript,
  type BroadcastSlide,
  type BroadcastMeta,
} from "@/agents/narrator";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  let slides: BroadcastSlide[] = [];
  let meta: BroadcastMeta = { destination: "the destination", totalDays: 1 };

  try {
    const body = (await req.json()) as { slides?: unknown; meta?: Partial<BroadcastMeta> };
    if (Array.isArray(body.slides)) {
      slides = body.slides
        .filter(
          (s): s is BroadcastSlide =>
            !!s && typeof s === "object" && typeof (s as BroadcastSlide).title === "string",
        )
        .slice(0, 24)
        .map((s) => ({
          day: Number(s.day) || 1,
          kicker: String(s.kicker ?? ""),
          title: String(s.title).slice(0, 120),
          sub: s.sub ? String(s.sub).slice(0, 200) : undefined,
        }));
    }
    meta = {
      destination: String(body.meta?.destination ?? meta.destination).slice(0, 80),
      clubName: body.meta?.clubName ? String(body.meta.clubName).slice(0, 80) : undefined,
      totalDays: Math.max(1, Number(body.meta?.totalDays) || 1),
    };
  } catch {
    /* fall through with defaults */
  }

  if (slides.length === 0) {
    return NextResponse.json(
      { error: "slides required", intro: "", lines: [], outro: "", source: "template" },
      { status: 400 },
    );
  }

  const script = await generateBroadcastScript(slides, meta);
  return NextResponse.json(script);
}
