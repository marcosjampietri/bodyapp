"use client";

import Link from "next/link";
import { useState } from "react";
import { useWorkoutStore } from "../../stores/WorkoutStore";
import { useTheme } from "../../context/ThemeContext";
import { X, Dumbbell, ChevronUp, ChevronDown } from "lucide-react";

export default function WorkoutPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { currentWorkout, removeExercise } = useWorkoutStore();

  // Default expanded so behavior matches what you have today
  const [isExpanded, setIsExpanded] = useState(true);

  if (!currentWorkout) return null;

  const count = currentWorkout.exercises.length;

  return (
    <div
      className={`
        fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md 
        py-1 px-4 rounded-t-lg border-t shadow-2xl z-50
        ${
          isDark
            ? "bg-zinc-900 border-orange-900/30 shadow-orange-900/10"
            : "bg-white border-red-200 shadow-red-100/30"
        }
      `}
    >
      {/* Header row: link on left, toggle on right */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/workout"
          className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${
            isDark ? "text-orange-400" : "text-red-600"
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          GO TO WORKOUT ({count})
        </Link>

        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-label={isExpanded ? "Collapse workout" : "Expand workout"}
          aria-expanded={isExpanded}
          className={`p-1.5 rounded-sm transition ${
            isDark
              ? "text-zinc-400 hover:text-white hover:bg-zinc-800"
              : "text-zinc-500 hover:text-zinc-900 hover:bg-gray-100"
          }`}
        >
          {isExpanded ? (
            <ChevronDown className="w-6 h-6" />
          ) : (
            <ChevronUp className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Chips: only when expanded, capped height with scroll */}
      {isExpanded && count > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
          {currentWorkout.exercises.map((ex) => (
            <div
              key={ex._id}
              className={`
                px-2 py-1 rounded-full text-xs flex items-center gap-1 max-w-full
                ${
                  isDark
                    ? "bg-zinc-800 text-zinc-300"
                    : "bg-gray-100 text-zinc-700"
                }
              `}
            >
              <span className="truncate">{ex.name}</span>
              <button
                onClick={() => removeExercise(ex._id)}
                aria-label={`Remove ${ex.name}`}
                className={`p-0.5 rounded-full hover:bg-red-500/20 transition shrink-0 ${
                  isDark
                    ? "text-zinc-500 hover:text-red-400"
                    : "text-zinc-400 hover:text-red-500"
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
