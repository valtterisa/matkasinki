// POST /api/onboarding — persist the vibe-quiz result as the user's profile.
// The profile is the baseline preference feed for Discovery, Trip Planner,
// Activity Finder, and the Scout Agent.

import { NextResponse } from "next/server";
import { z } from "zod";
import { readState, updateState } from "@/lib/store";

const ProfileSchema = z.object({
  vibe: z.enum([
    "explorer",
    "foodie",
    "beach-lounger",
    "culture-seeker",
    "adrenaline",
  ]),
  clubName: z.string().min(1).max(80),
  formation: z.string().min(3).max(12),
  colors: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).length(2),
  flavor: z.string().min(1).max(400),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid profile", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const state = updateState((s) => {
    s.profile = parsed.data;
  });

  return NextResponse.json({ ok: true, profile: state.profile });
}

export async function GET() {
  return NextResponse.json({ profile: readState().profile ?? null });
}
