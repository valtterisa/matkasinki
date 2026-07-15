import {
  handleRoutePlannerGet,
  handleRoutePlannerPost,
} from "@/agents/route-planner/handler";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  return handleRoutePlannerGet(req);
}

export async function POST(req: Request) {
  return handleRoutePlannerPost(req);
}
