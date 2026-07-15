"use client";

import "./routes.css";
import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { LocalRoutePlan } from "@/features/local-routes/types";
import RouteChat from "@/components/routes/RouteChat";
import PlanMapHeader from "@/components/routes/PlanMapHeader";
import RouteSteps from "@/components/routes/RouteSteps";

const TravelMap = dynamic(() => import("@/components/routes/TravelMap"), {
  ssr: false,
  loading: () => (
    <div className="planner-map__wrap planner-map__wrap--empty">Map</div>
  ),
});

interface RoutePlannerViewProps {
  api?: string;
  layout?: "page" | "chat";
}

function RoutePlannerInner({ api = "/api/chat", layout = "page" }: RoutePlannerViewProps) {
  const searchParams = useSearchParams();
  const planId = searchParams.get("id");
  const [plan, setPlan] = useState<LocalRoutePlan | null>(null);
  const [streaming, setStreaming] = useState(false);

  const loadById = useCallback(
    async (id: string) => {
      const res = await fetch(`${api}?id=${encodeURIComponent(id)}`);
      if (!res.ok) return;
      const data = (await res.json()) as { plan?: LocalRoutePlan };
      if (data.plan) setPlan(data.plan);
    },
    [api],
  );

  useEffect(() => {
    if (planId) void loadById(planId);
  }, [planId, loadById]);

  const isChat = layout === "chat";

  return (
    <main className={`planner ${isChat ? "planner--chat chat-page" : "planner--page"}`}>
      <header className="planner__top">
        <h1 className="planner__title">Helsinki</h1>
        {plan && <span className="planner__meta">{plan.title}</span>}
      </header>

      <div className="planner__grid">
        <div className="planner__chat">
          <RouteChat
            api={api}
            onPlanChange={setPlan}
            onStreamingChange={setStreaming}
          />
        </div>
        <div className="planner__map">
          <PlanMapHeader plan={plan} streaming={streaming} />
          <Suspense fallback={<div className="planner-map__wrap planner-map__wrap--empty">Map</div>}>
            <TravelMap plan={plan} />
          </Suspense>
          <RouteSteps plan={plan} />
        </div>
      </div>
    </main>
  );
}

export default function RoutePlannerView(props: RoutePlannerViewProps) {
  return (
    <Suspense fallback={<main className="planner" />}>
      <RoutePlannerInner {...props} />
    </Suspense>
  );
}
