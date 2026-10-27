import { memo } from "react";
import type { Stroke } from "@/lib/visitors";

// Presence updates should not rebuild thousands of unchanged SVG points.
export const Drawing = memo(function Drawing({
  strokes,
}: {
  strokes: Stroke[];
}) {
  return strokes.map((stroke, index) => {
    const color = stroke.color === "eraser" ? "#c5c5c5" : stroke.color;
    return stroke.points.length === 1 ? (
      // Strokes are append-only within a drawing; undo removes from its end.
      <circle
        // biome-ignore lint/suspicious/noArrayIndexKey: stroke order defines paint order
        key={index}
        cx={stroke.points[0][0]}
        cy={stroke.points[0][1]}
        r={stroke.size / 2}
        fill={color}
      />
    ) : (
      <polyline
        // biome-ignore lint/suspicious/noArrayIndexKey: stroke order defines paint order
        key={index}
        points={stroke.points.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={stroke.size}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  });
});
