// Pure, client-safe commentary templates for the Narrator broadcast (§13).
// Used as the no-API-key fallback on the server AND as the instant client-side
// script while /api/narrator is in flight. Deterministic per slide.

export interface BroadcastSlide {
  day: number;
  kicker: string; // "DAY 2 — AFTERNOON"
  title: string; // "Livraria Lello"
  sub?: string; // one-line detail
}

export interface BroadcastMeta {
  destination: string;
  clubName?: string;
  totalDays: number;
}

const DAY_WORDS = [
  "Day one", "Day two", "Day three", "Day four", "Day five",
  "Day six", "Day seven", "Day eight", "Day nine", "Day ten",
];

const OPENERS = [
  "And what a fixture this is —",
  "Oh, this is a big one —",
  "The away end is bouncing —",
  "You can feel the buzz around the ground —",
  "Scenes here, absolute scenes —",
  "The tactics board says it all —",
  "A masterclass in the making —",
  "The scouts are on their feet —",
];

const MIDDLES = [
  "the manager heads to {title}, a stunning fixture on this {destination} tour",
  "{title} is next on the team sheet, and it does not disappoint",
  "the itinerary reads {title}, and the travelling support approves",
  "it's {title} — circled in red on every scout's notebook",
  "up next, {title}, the kind of away day managers dream about",
  "{title} awaits, and the pre-match analysis says it's unmissable",
];

const CLOSERS = [
  "One for the highlight reel.",
  "Top-corner stuff, this.",
  "The club shop will be selling postcards of this one.",
  "Three points for the itinerary, surely.",
  "That's champagne football, that is.",
  "The gaffer's notebook is out — big performance.",
  "Somewhere, a rival manager is watching nervously.",
  "File that under 'worth the trip'.",
];

const INTRO = [
  "{club} are ON TOUR! {days} days in {destination}, and the broadcast team has every fixture covered. Welcome to matchday — this is your itinerary, live.",
  "Good evening and welcome to {destination}! {club} touch down for a {days}-day campaign, and the atmosphere is electric. Let's go pitchside.",
];

const OUTRO = [
  "And that's the full itinerary! {destination}: completed it. The squad heads home with memories, morale, and one or two new signings. From all of us in the gantry — safe travels, manager.",
  "Full-time in {destination}! What a campaign — every fixture, every flavour, every finding. The manager takes a bow. Until the next away day: goodnight!",
];

function seeded(i: number, salt: number, mod: number): number {
  let h = (i * 2654435761 + salt * 40503) >>> 0;
  h ^= h >>> 13;
  return h % mod;
}

function fill(t: string, slide: BroadcastSlide, meta: BroadcastMeta): string {
  return t
    .replace(/\{title\}/g, slide.title)
    .replace(/\{destination\}/g, meta.destination)
    .replace(/\{club\}/g, meta.clubName ?? "The manager's side")
    .replace(/\{days\}/g, String(meta.totalDays));
}

/** Sports-commentary line for one slide — deterministic, no API needed. */
export function templateCommentary(slide: BroadcastSlide, index: number, meta: BroadcastMeta): string {
  const dayWord = DAY_WORDS[Math.max(0, Math.min(DAY_WORDS.length - 1, slide.day - 1))];
  const opener = OPENERS[seeded(index, 1, OPENERS.length)];
  const middle = fill(MIDDLES[seeded(index, 2, MIDDLES.length)], slide, meta);
  const closer = CLOSERS[seeded(index, 3, CLOSERS.length)];
  const subBit = slide.sub ? ` ${slide.sub}.` : "";
  return `${dayWord}, and ${opener.charAt(0).toLowerCase()}${opener.slice(1)} ${middle}.${subBit} ${closer}`;
}

export function templateIntro(meta: BroadcastMeta): string {
  return fill(INTRO[meta.totalDays % INTRO.length], { day: 1, kicker: "", title: "" }, meta);
}

export function templateOutro(meta: BroadcastMeta): string {
  return fill(OUTRO[meta.totalDays % OUTRO.length], { day: 1, kicker: "", title: "" }, meta);
}

/** Full fallback script: one commentary line per slide (intro/outro slides included by caller). */
export function templateScript(slides: BroadcastSlide[], meta: BroadcastMeta): string[] {
  return slides.map((s, i) => templateCommentary(s, i, meta));
}
