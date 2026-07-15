import { getToolName, isToolUIPart } from "ai";
import LegsPreviewVisual from "./LegsPreviewVisual";
import PlaceResultsVisual from "./PlaceResultsVisual";
import PlanVisualCard from "./PlanVisualCard";
import { TOOL_LABELS } from "./format";

function ToolLoadingLine({ name }: { name: string }) {
  const label = TOOL_LABELS[name] ?? name;
  return (
    <div className="tool-line tool-line--active">
      <span className="tool-line__dot" aria-hidden />
      {label}
    </div>
  );
}

function ToolErrorLine({ name, error }: { name: string; error?: string }) {
  return (
    <div className="tool-line tool-line--error">
      {TOOL_LABELS[name] ?? name}
      {error ? ` — ${error}` : " failed"}
    </div>
  );
}

export function ToolPartVisual({ part }: { part: unknown }) {
  if (!part || typeof part !== "object") return null;
  if (!isToolUIPart(part as Parameters<typeof isToolUIPart>[0])) return null;

  const toolPart = part as {
    state: string;
    output?: unknown;
    errorText?: string;
  };
  const name = getToolName(part as Parameters<typeof getToolName>[0]);

  if (
    toolPart.state === "input-streaming" ||
    toolPart.state === "input-available" ||
    toolPart.state === "approval-requested"
  ) {
    return <ToolLoadingLine name={name} />;
  }

  if (toolPart.state === "output-error") {
    return <ToolErrorLine name={name} error={toolPart.errorText} />;
  }

  if (toolPart.state !== "output-available") return null;

  switch (name) {
    case "searchPlaces":
      return <PlaceResultsVisual output={toolPart.output} />;
    case "geocodePlace":
      return <PlaceResultsVisual output={toolPart.output} />;
    case "planItinerary":
      return <LegsPreviewVisual output={toolPart.output} />;
    case "savePlan":
      return <PlanVisualCard output={toolPart.output} />;
    default:
      return (
        <div className="tool-line">
          {TOOL_LABELS[name] ?? name}
        </div>
      );
  }
}
