import { getToolName, isToolUIPart, type UIMessage } from "ai";
import type { LocalRoutePlan } from "@/features/local-routes/types";

export function extractPlanFromMessages(messages: UIMessage[]): LocalRoutePlan | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "assistant" || !msg.parts) continue;
    for (const part of msg.parts) {
      if (!isToolUIPart(part)) continue;
      if (getToolName(part) !== "savePlan") continue;
      if (part.state !== "output-available") continue;
      const raw = part.output;
      if (raw && typeof raw === "object") {
        const o = raw as { plan?: LocalRoutePlan };
        if (o.plan) return o.plan;
      }
    }
  }
  return null;
}
