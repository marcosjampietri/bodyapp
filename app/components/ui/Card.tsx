"use client";

import { ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "stats" | "highlight";
  hover?: boolean;
}

export function Card({
  children,
  className = "",
  variant = "default",
  hover = false,
}: CardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const variants = {
    default: isDark
      ? "bg-linear-to-br from-zinc-900 to-zinc-950 border-red-900/20"
      : "bg-white border-red-200",
    stats: isDark
      ? "bg-linear-to-br from-zinc-900 to-zinc-950 border-red-900/20"
      : "bg-red-50 border-red-200",
    highlight: isDark
      ? "bg-linear-to-r from-red-950/70 via-red-900/40 to-red-950/70 border-red-800/30"
      : "bg-red-50 border-red-200",
  };

  return (
    <div
      className={`
        ${variants[variant]}
        border rounded-sm p-4 shadow-lg shadow-black/20 transition-all
        ${hover ? (isDark ? "hover:border-red-700/50" : "hover:border-red-300 hover:shadow-md") : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
