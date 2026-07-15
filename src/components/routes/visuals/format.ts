import type { Place, RouteLeg, RouteStop } from "@/features/local-routes/types";

export type ModeStyle = {
  color: string;
  label: string;
  dash?: [number, number];
};

export function modeStyle(mode: string): ModeStyle {
  const m = mode.toUpperCase();
  if (m === "WALK") return { color: "#b8c4d9", label: "Walk", dash: [2, 2] };
  if (m === "BUS") return { color: "#fbbf24", label: "Bus" };
  if (m === "TRAM") return { color: "#34d399", label: "Tram" };
  if (m === "RAIL" || m === "SUBWAY") return { color: "#60a5fa", label: "Metro" };
  if (m === "FERRY") return { color: "#a78bfa", label: "Ferry" };
  if (m === "BICYCLE") return { color: "#f472b6", label: "Bike" };
  return { color: "#34d399", label: mode };
}

export function isWalkMode(mode: string): boolean {
  return mode.toUpperCase() === "WALK";
}

export function modeTag(mode: string, line?: string): string {
  const m = mode.toUpperCase();
  if (line && !isWalkMode(m)) return line;
  if (m === "RAIL" || m === "SUBWAY") return "METRO";
  return m.slice(0, 4);
}

export function modeColor(mode: string): string {
  return modeStyle(mode).color;
}

export function categoryTag(category?: string): string {
  if (!category) return "·";
  const c = category.toLowerCase();
  if (c.includes("museum")) return "mus";
  if (c.includes("restaurant")) return "eat";
  if (c.includes("bar") || c.includes("pub")) return "bar";
  if (c.includes("cafe")) return "caf";
  if (c.includes("historic")) return "his";
  return c.slice(0, 3);
}

export function formatDuration(seconds: number): string {
  const m = Math.max(1, Math.round(seconds / 60));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}h ${rest}m` : `${h}h`;
}

export function planStats(stops: RouteStop[], legs: RouteLeg[]) {
  const totalSeconds = legs.reduce((s, l) => s + l.durationSeconds, 0);
  const walkSeconds = legs
    .filter((l) => isWalkMode(l.mode))
    .reduce((s, l) => s + l.durationSeconds, 0);
  const transitLegs = legs.filter((l) => !isWalkMode(l.mode)).length;
  return {
    stopCount: stops.length,
    totalMinutes: Math.round(totalSeconds / 60),
    walkMinutes: Math.round(walkSeconds / 60),
    transitLegs,
  };
}

export function statsLine(stops: RouteStop[], legs: RouteLeg[]): string {
  const s = planStats(stops, legs);
  return `${s.stopCount} stops · ${s.totalMinutes} min · ${s.transitLegs} transit · ${s.walkMinutes}m walk`;
}

export const ROUTE_LEGEND: ModeStyle[] = [
  modeStyle("WALK"),
  modeStyle("TRAM"),
  modeStyle("BUS"),
  modeStyle("RAIL"),
];

export const TOOL_LABELS: Record<string, string> = {
  searchPlaces: "Places",
  geocodePlace: "Geocode",
  planItinerary: "HSL route",
  savePlan: "Plan",
};

export function placeList(places: Place[], limit = 5): Place[] {
  return places.slice(0, limit);
}

export function stopMarkerTone(order: number, total: number): "start" | "mid" | "end" {
  if (order === 1) return "start";
  if (order === total) return "end";
  return "mid";
}
