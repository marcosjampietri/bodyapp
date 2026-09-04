"use client";

import { useTheme } from "../../context/ThemeContext";
import { AlertTriangle } from "lucide-react";

interface WorkoutProgressProps {
  percentage: number;
  mission: string;
}

export function WorkoutProgress({ percentage, mission }: WorkoutProgressProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`p-3 mb-6 flex items-center gap-3 rounded-sm border ${
        isDark
          ? "bg-linear-to-r from-red-950/70 via-red-900/40 to-red-950/70 border-red-800/30 shadow-lg shadow-red-900/20"
          : "bg-red-50 border-red-200 shadow-sm"
      }`}
    >
      <AlertTriangle
        className={`w-5 h-5 shrink-0 ${
          isDark
            ? "text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]"
            : "text-red-500"
        }`}
      />
      <p
        className={`text-xs font-medium uppercase tracking-wider ${
          isDark
            ? "text-red-400 drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]"
            : "text-red-600"
        }`}
      >
        {mission}
      </p>
      <span
        className={`ml-auto text-xs font-black ${
          isDark
            ? "text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]"
            : "text-red-500"
        }`}
      >
        {percentage}%
      </span>
    </div>
  );
}
