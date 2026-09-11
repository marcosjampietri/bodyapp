"use client";

import { useWorkoutStore } from "../../stores/WorkoutStore";
import { useTheme } from "../../context/ThemeContext";
import { Exercise } from "../../db/models/Exercises";
import { Plus, Check } from "lucide-react";

export default function ExercisesList({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { addExercise, currentWorkout } = useWorkoutStore();

  const isExerciseAdded = (exercise: Exercise) => {
    return currentWorkout?.exercises.some((e) => e.id === exercise.id) || false;
  };

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => {
        const added = isExerciseAdded(exercise);
        return (
          <div
            key={exercise._id}
            className={`
              p-4 rounded-sm border transition-all
              ${
                isDark
                  ? `bg-linear-to-br from-zinc-900 to-zinc-950 ${
                      added
                        ? "border-green-800/50 bg-linear-to-br from-green-950/20 to-zinc-900"
                        : "border-zinc-800/50 hover:border-orange-700/50"
                    }`
                  : `bg-white ${
                      added
                        ? "border-green-300 bg-green-50/50"
                        : "border-gray-200 hover:border-red-300"
                    }`
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-black text-sm uppercase tracking-wider truncate ${
                    isDark ? "text-white" : "text-zinc-800"
                  }`}
                >
                  {exercise.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] uppercase tracking-wider">
                  <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>
                    {exercise.primaryMuscles.join(", ")}
                  </span>
                  <span className={isDark ? "text-zinc-600" : "text-zinc-300"}>
                    •
                  </span>
                  <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>
                    {exercise.equipment}
                  </span>
                  {/* 
                  
                  <span className={isDark ? "text-zinc-600" : "text-zinc-300"}>
                    •
                  </span>
                  <span
                    className={`capitalize ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                  >
                    {exercise.level}
                  </span> */}
                </div>
              </div>
              <button
                onClick={() => addExercise(exercise)}
                disabled={added}
                className={`
                  shrink-0 ml-3 px-4 py-1.5 rounded-sm text-xs font-black uppercase tracking-wider transition
                  ${
                    added
                      ? isDark
                        ? "bg-green-600/30 text-green-400 border border-green-600/30 cursor-default"
                        : "bg-green-100 text-green-600 border border-green-300 cursor-default"
                      : isDark
                        ? "bg-orange-600 hover:bg-orange-700 text-white border border-orange-600/30 shadow-lg shadow-orange-600/20"
                        : "bg-red-600 hover:bg-red-700 text-white border border-red-400 shadow-sm"
                  }
                `}
              >
                {added ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" /> Added
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </span>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
