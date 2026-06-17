import type { CSSProperties } from "react";

/**
 * Ícone Material Symbols Outlined — usado em todo o app conforme o design
 * "Nocturnal Pulse" do Stitch.
 *
 * Uso:
 *   <Icon name="shopping_cart" className="text-primary" />
 *   <Icon name="home" filled className="text-2xl" />
 */
export function Icon({
  name,
  className = "",
  filled = false,
  style,
  ...rest
}: {
  name: string;
  className?: string;
  filled?: boolean;
  style?: CSSProperties;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined${filled ? " filled" : ""} ${className}`.trim()}
      style={style}
      {...rest}
    >
      {name}
    </span>
  );
}
