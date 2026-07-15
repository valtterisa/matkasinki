"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useState } from "react";
import { CHAT_SUGGESTIONS } from "@/features/local-routes/chat-suggestions";
import type { LocalRoutePlan } from "@/features/local-routes/types";
import ChatMessageVisual from "@/components/routes/visuals/ChatMessageVisual";
import { extractPlanFromMessages } from "@/lib/local-routes/extract-plan";

interface RouteChatProps {
  api?: string;
  onPlanChange: (plan: LocalRoutePlan | null) => void;
  onStreamingChange?: (streaming: boolean) => void;
}

export default function RouteChat({ api = "/api/chat", onPlanChange, onStreamingChange }: RouteChatProps) {
  const [input, setInput] = useState("");
  const transport = useMemo(() => new DefaultChatTransport({ api }), [api]);

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onFinish: ({ messages: finished }) => {
      const plan = extractPlanFromMessages(finished);
      if (plan) onPlanChange(plan);
    },
  });

  useEffect(() => {
    const plan = extractPlanFromMessages(messages);
    if (plan) onPlanChange(plan);
  }, [messages, onPlanChange]);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    onStreamingChange?.(busy);
  }, [busy, onStreamingChange]);

  const submitText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    void sendMessage({ text: trimmed });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitText(input);
  };

  return (
    <div className="planner-chat">
      <div className="planner-chat__head">Chat</div>
      <div className="planner-chat__scroll">
        {messages.length === 0 && (
          <div className="planner-chat__welcome">
            <p className="planner-chat__welcome-title">Plan a Helsinki day</p>
            <p className="planner-chat__welcome-copy">
              Ask in plain language — or tap an example to get started.
            </p>
            <div className="planner-chat__suggestions">
              {CHAT_SUGGESTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="planner-chat__suggestion"
                  disabled={busy}
                  onClick={() => submitText(s.prompt)}
                >
                  {s.prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <ChatMessageVisual key={m.id} message={m} />
        ))}
        {error && <p className="planner-error">{error.message}</p>}
      </div>

      <form onSubmit={handleSubmit} className="planner-chat__form">
        <textarea
          className="planner-chat__input"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Plan a Helsinki trip with museums"
          disabled={busy}
        />
        <button type="submit" className="planner-chat__send" disabled={busy || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
