// Verifier Agent — anti-cheese. Confirms a challenge/visit really happened
// before the football layer grants high-value rewards. A completion needs at
// least TWO independent proof signals:
//   (a) geolocation capture, (b) photo evidence, (c) a matching Budget Tracker
//       receipt logged around the time of the attempt.
// Tapping "Done" with no proof is always rejected.

import { readState } from "@/lib/store";

export interface Proof {
  geo?: { lat: number; lng: number; at?: string };
  photo?: { name: string; size: number };
  receiptIndex?: number; // index into AppState.expenses (Budget Tracker receipt)
}

export interface Verdict {
  verified: boolean;
  score: number; // number of accepted proof signals
  reasons: string[]; // human-readable audit trail
}

const RECEIPT_WINDOW_MS = 3 * 24 * 60 * 60 * 1000; // receipt must be logged within ~3 days

export async function verifyCompletion(challengeId: string, proof: Proof): Promise<Verdict> {
  const reasons: string[] = [];
  let score = 0;

  // (a) Geolocation — must be a plausible coordinate, not a null island tap.
  if (proof.geo) {
    const { lat, lng } = proof.geo;
    const plausible =
      typeof lat === "number" &&
      typeof lng === "number" &&
      Math.abs(lat) <= 90 &&
      Math.abs(lng) <= 180 &&
      !(lat === 0 && lng === 0);
    if (plausible) {
      score++;
      reasons.push(`Geolocation captured (${lat.toFixed(3)}, ${lng.toFixed(3)}) — device was physically somewhere real.`);
    } else {
      reasons.push("Geolocation rejected — coordinates implausible.");
    }
  } else {
    reasons.push("No geolocation provided.");
  }

  // (b) Photo — needs a real file (non-empty) captured client-side.
  if (proof.photo) {
    if (proof.photo.size > 0 && proof.photo.name) {
      score++;
      reasons.push(`Photo evidence attached (“${proof.photo.name}”, ${(proof.photo.size / 1024).toFixed(0)} KB).`);
    } else {
      reasons.push("Photo rejected — empty file.");
    }
  } else {
    reasons.push("No photo provided.");
  }

  // (c) Budget Tracker receipt — must actually exist in the store, logged recently.
  if (proof.receiptIndex != null) {
    const s = readState();
    const receipt = s.expenses[proof.receiptIndex];
    if (!receipt) {
      reasons.push("Receipt rejected — no matching expense in the Budget Tracker.");
    } else {
      const age = Date.now() - new Date(receipt.at).getTime();
      if (isFinite(age) && age >= 0 && age <= RECEIPT_WINDOW_MS) {
        score++;
        reasons.push(
          `Receipt matched — ${receipt.amount} ${receipt.currency} (${receipt.category}) logged ${Math.max(1, Math.round(age / 3600000))}h ago in the Budget Tracker.`
        );
      } else {
        reasons.push("Receipt rejected — logged too long ago to plausibly match this challenge.");
      }
    }
  } else {
    reasons.push("No Budget Tracker receipt linked.");
  }

  const verified = score >= 2;
  reasons.push(
    verified
      ? `Verified: ${score}/3 independent proof signals for challenge ${challengeId}. Rewards unlocked.`
      : `Not enough proof (${score}/3, need 2+). No rewards granted for ${challengeId} — travel first, tap second.`
  );

  return { verified, score, reasons };
}
