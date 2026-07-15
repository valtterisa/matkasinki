import type { CSSProperties } from "react";
import type { RouteLeg } from "@/features/local-routes/types";
import { formatDuration, modeStyle, modeTag } from "./format";

interface LegsPreviewVisualProps {
  output: unknown;
}

export default function LegsPreviewVisual({ output }: LegsPreviewVisualProps) {
  const data = output as { legCount?: number; legs?: RouteLeg[] } | null;
  const legs = data?.legs ?? [];
  if (!legs.length) return null;

  return (
    <div className="tool-block">
      <span className="tool-block__label">{data?.legCount ?? legs.length} legs</span>
      {legs.map((leg, i) => {
        const style = modeStyle(leg.mode);
        return (
          <div
            key={i}
            className="tool-leg tool-leg--card"
            style={{ "--leg-color": style.color } as CSSProperties}
          >
            <span className="tool-leg__mode">{modeTag(leg.mode, leg.line)}</span>
            <span>
              {leg.instruction || `${leg.fromName} → ${leg.toName}`}
              <span className="tool-leg__meta"> · {formatDuration(leg.durationSeconds)}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
