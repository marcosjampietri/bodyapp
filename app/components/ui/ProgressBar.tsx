"use client";

import { useTheme } from "../../context/ThemeContext";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className = "",
  showLabel = false,
}: ProgressBarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
        w-full h-2 rounded-sm overflow-hidden
        ${isDark ? "bg-white/10" : "bg-gray-200"}
      `}
      >
        <div
          className={`
            h-full rounded-sm transition-all duration-500
            ${isDark ? "bg-linear-to-r from-red-600 to-orange-500" : "bg-red-600"}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p
          className={`text-[10px] font-bold mt-1 ${
            isDark ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
}
