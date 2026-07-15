import { createAgentUIStreamResponse } from "ai";
import { getSamplePlanForPrompt } from "@/features/local-routes";
import { getRoute, listRoutes, saveRoute } from "@/lib/local-routes/store";
import { createSampleStreamResponse, createErrorStreamResponse } from "./demo-stream";
import { isRoutePlannerAvailable, routePlannerAgent } from "./index";

export async function handleRoutePlannerGet(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) {
    const plan = getRoute(id);
    if (!plan) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ plan });
  }
  return Response.json({
    routes: listRoutes(),
    agentAvailable: isRoutePlannerAvailable(),
  });
}

function promptFromBody(body: {
  prompt?: string;
  message?: string;
  messages?: unknown[];
}): string {
  if (typeof body.prompt === "string" && body.prompt.trim()) return body.prompt.trim();
  if (typeof body.message === "string" && body.message.trim()) return body.message.trim();
  if (Array.isArray(body.messages)) {
    for (let i = body.messages.length - 1; i >= 0; i--) {
      const msg = body.messages[i];
      if (!msg || typeof msg !== "object") continue;
      const m = msg as { role?: string; parts?: { type?: string; text?: string }[] };
      if (m.role !== "user" || !Array.isArray(m.parts)) continue;
      const text = m.parts
        .filter((p) => p?.type === "text" && typeof p.text === "string")
        .map((p) => p.text)
        .join("")
        .trim();
      if (text) return text;
    }
  }
  return "";
}

export async function handleRoutePlannerPost(req: Request): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as {
    messages?: unknown[];
    action?: string;
    prompt?: string;
    message?: string;
  };

  let uiMessages = body.messages;
  if ((!uiMessages || !Array.isArray(uiMessages) || uiMessages.length === 0) && body.message) {
    const text = typeof body.message === "string" ? body.message.trim() : "";
    if (text) {
      uiMessages = [{ id: "legacy-user", role: "user", parts: [{ type: "text", text }] }];
    }
  }

  if (!Array.isArray(uiMessages) || uiMessages.length === 0) {
    return Response.json({ error: "messages required" }, { status: 400 });
  }

  if (!isRoutePlannerAvailable()) {
    const prompt = promptFromBody(body);
    const { plan, reply } = getSamplePlanForPrompt(prompt);
    const saved = saveRoute(plan);
    return createSampleStreamResponse(saved, reply);
  }

  try {
    return await createAgentUIStreamResponse({
      agent: routePlannerAgent,
      uiMessages,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Route planner failed";
    return createErrorStreamResponse(message);
  }
}
