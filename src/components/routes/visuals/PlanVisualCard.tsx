import type { LocalRoutePlan } from "@/features/local-routes/types";
import { statsLine } from "./format";

interface PlanVisualCardProps {
  output: unknown;
}

export default function PlanVisualCard({ output }: PlanVisualCardProps) {
  const data = output as { plan?: LocalRoutePlan; ok?: boolean } | null;
  const plan = data?.plan;
  if (!plan) return null;

  return (
    <div className="tool-plan">
      <strong>{plan.title}</strong>
      <span style={{ color: "var(--fg-muted)" }}> · {statsLine(plan.stops, plan.legs)}</span>
    </div>
  );
}
