"use client";

import Link from "next/link";
import { useTheme } from "./context/ThemeContext";
import { ThemeToggle } from "./components/theme/ThemeToggle";
import { Shield, Dumbbell, Apple, Lock } from "lucide-react";
import { useWorkoutStore } from "./stores/WorkoutStore";
import { useEffect } from "react";

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { syncWorkouts } = useWorkoutStore();

  useEffect(() => {
    syncWorkouts();
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-md mx-auto w-full px-4 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className={`w-14 h-14 rounded-sm flex items-center justify-center mb-3 ${
              isDark
                ? "bg-linear-to-br from-red-600 to-orange-500 shadow-lg shadow-orange-600/30"
                : "bg-red-600 shadow-md shadow-red-200"
            }`}
          >
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1
            className={`text-2xl font-black tracking-tight ${
              isDark
                ? "bg-linear-to-r from-red-500 to-orange-400 bg-clip-text text-transparent"
                : "text-red-600"
            }`}
          >
            IRON
          </h1>
          <p
            className={`text-[10px] uppercase tracking-[0.3em] font-black mt-1 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Pain is progress
          </p>
        </div>

        {/* Cards */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          {/* Workout Card */}
          <Link
            href="/workout"
            className={`
              group relative block p-6 rounded-sm border transition-all
              ${
                isDark
                  ? "bg-linear-to-br from-zinc-900 to-zinc-950 border-orange-500/40 shadow-lg shadow-orange-600/20 hover:border-orange-500/70 hover:shadow-orange-600/40"
                  : "bg-white border-red-300 shadow-md shadow-red-200/50 hover:border-red-400 hover:shadow-red-300/70"
              }
            `}
          >
            <div className="flex items-center gap-4">
              <div
                className={`
                  w-14 h-14 rounded-sm flex items-center justify-center shrink-0
                  ${
                    isDark
                      ? "bg-linear-to-br from-red-600 to-orange-500 shadow-lg shadow-orange-600/30"
                      : "bg-red-600 shadow-md shadow-red-200"
                  }
                `}
              >
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className={`text-lg font-black uppercase tracking-wider ${
                    isDark ? "text-white" : "text-zinc-800"
                  }`}
                >
                  Workout
                </h2>
                <p
                  className={`text-[10px] uppercase tracking-wider mt-0.5 ${
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Build · Train · Conquer
                </p>
              </div>
              <span
                className={`text-xl font-black ${
                  isDark ? "text-orange-400" : "text-red-500"
                }`}
              >
                →
              </span>
            </div>
          </Link>

          {/* Nutrition Card (placeholder) */}
          <div
            className={`
              relative block p-6 rounded-sm border cursor-not-allowed
              ${
                isDark
                  ? "bg-zinc-900/50 border-zinc-800/50 opacity-60"
                  : "bg-gray-50 border-gray-200 opacity-60"
              }
            `}
          >
            <div className="flex items-center gap-4">
              <div
                className={`
                  w-14 h-14 rounded-sm flex items-center justify-center shrink-0
                  ${isDark ? "bg-zinc-800" : "bg-gray-200"}
                `}
              >
                <Apple
                  className={`w-7 h-7 ${
                    isDark ? "text-zinc-600" : "text-zinc-400"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className={`text-lg font-black uppercase tracking-wider ${
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Nutrition
                </h2>
                <p
                  className={`text-[10px] uppercase tracking-wider mt-0.5 ${
                    isDark ? "text-zinc-600" : "text-zinc-400"
                  }`}
                >
                  Coming soon
                </p>
              </div>
              <Lock
                className={`w-4 h-4 ${
                  isDark ? "text-zinc-700" : "text-zinc-300"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-10 text-center">
          <p
            className={`text-[8px] uppercase tracking-[0.3em] font-black ${
              isDark ? "text-orange-900/30" : "text-red-200"
            }`}
          >
            Steel forged in blood
          </p>
        </div>
      </div>
    </div>
  );
}
