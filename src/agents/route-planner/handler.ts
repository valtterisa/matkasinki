import { createAgentUIStreamResponse } from "ai";
import { demoHelsinkiRoute } from "@/features/local-routes";
import { getRoute, listRoutes, saveRoute } from "@/lib/local-routes/store";
import { isRoutePlannerAvailable, routePlannerAgent } from "./index";

export async function handleRoutePlannerGet(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) {
    const plan = getRoute(id);
    if (!plan) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ plan });
  }
  return Response.json({ routes: listRoutes() });
}

export async function handleRoutePlannerPost(req: Request): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as {
    messages?: unknown[];
    action?: string;
    prompt?: string;
    message?: string;
  };

  if (body.action === "demo") {
    const plan = saveRoute(demoHelsinkiRoute(body.prompt));
    return Response.json({ plan });
  }

  if (!isRoutePlannerAvailable()) {
    const plan = saveRoute(
      demoHelsinkiRoute(
        body.prompt ??
          (typeof body.message === "string" ? body.message : "Demo route (no API key)"),
      ),
    );
    return Response.json({
      error: "ANTHROPIC_API_KEY not set — loaded demo route instead",
      plan,
      demo: true,
    });
  }

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

  return createAgentUIStreamResponse({
    agent: routePlannerAgent,
    uiMessages,
  });
}
