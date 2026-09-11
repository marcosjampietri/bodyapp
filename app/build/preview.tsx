"use client";

import Link from "next/link";
import { useWorkoutStore } from "../stores/WorkoutStore";
import { useTheme } from "../context/ThemeContext";
import { X, Dumbbell } from "lucide-react";

export default function WorkoutPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { currentWorkout, removeExercise } = useWorkoutStore();

  if (!currentWorkout) return null;

  return (
    <div
      className={`
        fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md 
        p-4 rounded-t-lg border-t shadow-2xl z-50
        ${
          isDark
            ? "bg-zinc-900 border-orange-900/30 shadow-orange-900/10"
            : "bg-white border-red-200 shadow-red-100/30"
        }
      `}
    >
      <div className="flex items-center justify-between">
        <Link
          href="/workout"
          className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${
            isDark ? "text-orange-400" : "text-red-600"
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          GO TO WORKOUT ({currentWorkout.exercises.length})
        </Link>
      </div>

      {currentWorkout.exercises.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {currentWorkout.exercises.map((ex) => (
            <div
              key={ex._id}
              className={`
                  px-2 py-1 rounded-full text-xs
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
                className={`p-0.5 rounded-full hover:bg-red-500/20 transition ${
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
