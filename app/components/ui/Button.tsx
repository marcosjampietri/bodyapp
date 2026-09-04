"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import { useTheme } from "../../context/ThemeContext";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const variants = {
    primary: isDark
      ? "bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-red-600 text-white border border-red-600/50 shadow-lg shadow-red-600/20"
      : "bg-red-600 hover:bg-red-700 text-white border border-red-300 shadow-sm shadow-red-200",
    secondary: isDark
      ? "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700"
      : "bg-white hover:bg-gray-50 text-zinc-800 border border-red-200 hover:border-red-300",
    outline: isDark
      ? "bg-transparent hover:bg-red-950/20 text-red-500 border border-red-600/50 hover:border-red-600"
      : "bg-transparent hover:bg-red-50 text-red-600 border border-red-300 hover:border-red-400",
    danger: isDark
      ? "bg-red-700 hover:bg-red-800 text-white border border-red-600/30"
      : "bg-red-100 hover:bg-red-200 text-red-700 border border-red-300",
    success: isDark
      ? "bg-green-700 hover:bg-green-800 text-white border border-green-600/30"
      : "bg-green-100 hover:bg-green-200 text-green-700 border border-green-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        font-black uppercase tracking-wider rounded-sm transition-all
        ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
