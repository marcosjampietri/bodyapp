"use client";

import { ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "pr";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const variants = {
    default: isDark
      ? "border-red-600/30 bg-linear-to-r from-red-950/50 to-red-950/30 text-red-500"
      : "border-red-300 bg-red-50 text-red-600",
    success: isDark
      ? "border-green-600/30 bg-green-950/20 text-green-500"
      : "border-green-300 bg-green-50 text-green-600",
    danger: isDark
      ? "border-red-600/30 bg-red-950/20 text-red-500"
      : "border-red-300 bg-red-50 text-red-600",
    warning: isDark
      ? "border-amber-600/30 bg-amber-950/20 text-amber-500"
      : "border-amber-300 bg-amber-50 text-amber-600",
    pr: isDark
      ? "border-red-600/30 bg-linear-to-r from-red-950/50 to-red-950/30 text-red-500"
      : "border-red-300 bg-red-50 text-red-600",
  };

  return (
    <span
      className={`
        ${variants[variant]}
        text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest border
        ${className}
      `}
    >
      {children}
    </span>
  );
}
