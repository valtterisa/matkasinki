import type { UIMessage } from "ai";
import { ToolPartVisual } from "./ToolPartVisual";

interface ChatMessageVisualProps {
  message: UIMessage;
}

export default function ChatMessageVisual({ message }: ChatMessageVisualProps) {
  if (message.role === "user") {
    const text = message.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("")
      .trim();
    if (!text) return null;
    return <div className="msg--user">{text}</div>;
  }

  return (
    <div className="msg--assistant">
      {message.parts?.map((part, i) => {
        if (part.type === "text" && part.text.trim()) {
          return (
            <div key={i} className="msg__text">
              {part.text}
            </div>
          );
        }
        if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
          return <ToolPartVisual key={i} part={part} />;
        }
        return null;
      })}
    </div>
  );
}
