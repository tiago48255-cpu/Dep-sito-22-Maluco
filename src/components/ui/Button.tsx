"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "lavender" | "secondary" | "inverted" | "outlined" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

// Mapped to the design-system button classes defined in globals.css.
// `primary` is the royal (#1E2FBF) main CTA used across the references
// (Adicionar / Confirmar pedido); the other variants expose the rest of
// the documented design system (lavender / secondary / inverted / outlined).
const variantClasses: Record<Variant, string> = {
  primary: "btn-royal shadow-royal-glow",
  lavender: "btn-primary",
  secondary: "btn-secondary-ds",
  inverted: "btn-inverted",
  outlined: "btn-outlined-ds hover:bg-white/5",
  danger: "bg-red-700 hover:bg-red-800 text-white",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
