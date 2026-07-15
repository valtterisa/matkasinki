import RoutePlannerView from "@/components/routes/RoutePlannerView";

export default function RoutesClient() {
  return <RoutePlannerView api="/api/routes" layout="page" />;
}
