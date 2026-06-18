import type { CSSProperties } from "react";

/** Material Symbols Outlined glyph (ligature). */
export function Icon({
  name,
  size,
  fill = false,
  weight,
  className = "",
  style,
}: {
  name: string;
  size?: number;
  fill?: boolean;
  weight?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const settings = `'FILL' ${fill ? 1 : 0}, 'wght' ${weight ?? 400}, 'GRAD' 0, 'opsz' 48`;
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined${className ? " " + className : ""}`}
      style={{
        fontVariationSettings: settings,
        ...(size ? { fontSize: `${size}px` } : null),
        ...style,
      }}
    >
      {name}
    </span>
  );
}
