import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`glass-panel rounded-2xl ${hover ? "hover:border-white/10 transition-colors cursor-pointer" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
