import type { CSSProperties } from "react";
import type { LocalRoutePlan } from "@/features/local-routes/types";
import { formatDuration, modeStyle, modeTag } from "./format";

interface PlanTimelineProps {
  plan: LocalRoutePlan;
}

export default function PlanTimeline({ plan }: PlanTimelineProps) {
  return (
    <ol className="timeline">
      {plan.stops.map((stop, i) => {
        const leg = plan.legs[i];
        const legStyle = leg ? modeStyle(leg.mode) : null;

        return (
          <li key={stop.order} className="timeline__group">
            <div className="timeline__stop">
              <span
                className={`timeline__stop-mark timeline__stop-mark--${
                  stop.order === 1 ? "start" : stop.order === plan.stops.length ? "end" : "mid"
                }`}
              >
                {stop.order}
              </span>
              <div className="timeline__stop-body">
                <span className="timeline__stop-name">{stop.name}</span>
                {stop.dwellMinutes != null && stop.dwellMinutes > 0 && (
                  <span className="timeline__stop-meta">{stop.dwellMinutes} min here</span>
                )}
              </div>
            </div>

            {leg && legStyle && (
              <div
                className="timeline__leg"
                style={{ "--leg-color": legStyle.color } as CSSProperties}
              >
                <span className="timeline__leg-mode">{modeTag(leg.mode, leg.line)}</span>
                <div className="timeline__leg-body">
                  <span className="timeline__leg-instruction">{leg.instruction}</span>
                  <span className="timeline__leg-meta">
                    {formatDuration(leg.durationSeconds)}
                    {leg.line && leg.mode.toUpperCase() !== "WALK" ? ` · line ${leg.line}` : ""}
                    {leg.fromName && leg.toName ? ` · ${leg.fromName} → ${leg.toName}` : ""}
                  </span>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
