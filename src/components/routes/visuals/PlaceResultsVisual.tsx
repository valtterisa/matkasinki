import type { Place } from "@/features/local-routes/types";
import { categoryTag, placeList } from "./format";

interface PlaceResultsVisualProps {
  output: unknown;
}

export default function PlaceResultsVisual({ output }: PlaceResultsVisualProps) {
  const data = output as { count?: number; places?: Place[] } | null;
  const places = data?.places ?? [];
  if (!places.length) return null;

  const shown = placeList(places);
  const extra = places.length - shown.length;

  return (
    <div className="tool-block">
      <span className="tool-block__label">{data?.count ?? places.length} places</span>
      <ul className="tool-list">
        {shown.map((p) => (
          <li key={`${p.name}-${p.lat}`}>
            <span className="tool-list__tag">{categoryTag(p.category)}</span>
            {p.name}
          </li>
        ))}
      </ul>
      {extra > 0 && (
        <span className="tool-block__label">+{extra} more</span>
      )}
    </div>
  );
}
