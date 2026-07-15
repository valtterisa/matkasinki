import { ROUTE_LEGEND } from "./visuals/format";

export default function RouteMapLegend() {
  return (
    <div className="planner-map__legend" aria-label="Route legend">
      {ROUTE_LEGEND.map((item) => (
        <span key={item.label} className="planner-map__legend-item">
          <span
            className={`planner-map__legend-line${item.dash ? " planner-map__legend-line--dash" : ""}`}
            style={{ background: item.dash ? undefined : item.color, borderColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
