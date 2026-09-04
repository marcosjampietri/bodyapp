"use client";

import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import { ThemeToggle } from "../../components/theme/ThemeToggle";
import { Shield, User } from "lucide-react";

export function WorkoutHeader() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`flex justify-between items-center mb-8 border-b pb-4 ${
        isDark ? "border-red-900/20" : "border-red-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-sm flex items-center justify-center ${
            isDark
              ? "bg-linear-to-br from-red-600 to-orange-500 shadow-lg shadow-red-600/30"
              : "bg-red-600 shadow-md shadow-red-200"
          }`}
        >
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1
            className={`text-xl font-black tracking-tight ${
              isDark
                ? "bg-linear-to-r from-red-500 to-orange-400 bg-clip-text text-transparent"
                : "text-red-600"
            }`}
          >
            IRON
          </h1>
          <p className="text-[10px] text-zinc-500 tracking-widest uppercase">
            Pain is progress
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          className={`w-10 h-10 rounded-sm flex items-center justify-center transition ${
            isDark
              ? "bg-linear-to-br from-zinc-900 to-zinc-950 border border-red-900/30 hover:from-red-950 hover:to-zinc-900"
              : "bg-white border border-red-200 hover:bg-red-50 hover:border-red-300"
          }`}
        >
          <User
            className={`w-5 h-5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
          />
        </button>
      </div>
    </div>
  );
}
