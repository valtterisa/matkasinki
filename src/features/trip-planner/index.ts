// Trip Planner — chosen destination -> real, followable itinerary.
// Core is a genuine planner; introvert/low-effort input (defaults, swipe-to-react,
// "surprise me"). Only after a real itinerary exists is it mapped to a season/team.

export interface TripPlanInput {
  destination: string;         // handed over from discovery
  dates: { start: string; end: string };
  budget?: number;
  vibe: string;
}

export interface ItineraryDay {
  date: string;
  items: { time?: string; title: string; notes?: string }[];
}

export async function planTrip(_input: TripPlanInput): Promise<ItineraryDay[]> {
  throw new Error("not implemented");
}
