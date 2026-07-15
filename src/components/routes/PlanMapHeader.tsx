import type { LocalRoutePlan } from "@/features/local-routes/types";
import { statsLine } from "./visuals/format";

interface PlanMapHeaderProps {
  plan: LocalRoutePlan | null;
  streaming?: boolean;
}

export default function PlanMapHeader({ plan, streaming }: PlanMapHeaderProps) {
  if (!plan && !streaming) {
    return (
      <div className="planner-map__head">
        <span>Route</span>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="planner-map__head">
        <span>Planning…</span>
      </div>
    );
  }

  return (
    <div className="planner-map__head">
      <strong className="planner-map__title">{plan.title}</strong>
      <span>{statsLine(plan.stops, plan.legs)}</span>
    </div>
  );
}
