"use client";

import { useRouter } from "next/navigation";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";
import { useTheme } from "@/app/context/ThemeContext";

interface ControlsProps {
  exerciseId: string;
}

export default function Controls({ exerciseId }: ControlsProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { currentWorkout, addSet, removeSet, removeExercise } =
    useWorkoutStore();

  const exercise = currentWorkout?.exercises.find((e) => e._id === exerciseId);
  if (!exercise) return null;

  return (
    <div className="flex flex-row justify-center gap-4 mt-4">
      {/* Add Set */}
      <button
        onClick={() => addSet(exercise._id)}
        className={`
          px-6 py-3 rounded w-28 border text-xs font-bold uppercase tracking-wider transition
          ${
            isDark
              ? "bg-green-700 hover:bg-green-600 text-white border-green-600/30 shadow-lg shadow-green-700/20"
              : "bg-green-600 hover:bg-green-700 text-white border-green-400 shadow-sm"
          }
        `}
      >
        ADD SET
      </button>

      {/* Delete Set */}
      <button
        onClick={() => {
          if (exercise.sets.length > 1) {
            const lastSet = exercise.sets[exercise.sets.length - 1];
            removeSet(exercise._id, lastSet.id);
          }
        }}
        className={`
          px-6 py-3 rounded w-28 border text-xs font-bold uppercase tracking-wider transition
          ${
            isDark
              ? "bg-red-700 hover:bg-red-600 text-white border-red-600/30 shadow-lg shadow-red-700/20"
              : "bg-red-600 hover:bg-red-700 text-white border-red-400 shadow-sm"
          }
        `}
      >
        DELETE SET
      </button>

      {/* Delete All */}
      <button
        onClick={() => {
          removeExercise(exercise._id);
          router.back();
        }}
        className={`
          px-6 py-3 rounded w-28 border text-xs font-bold uppercase tracking-wider transition
          ${
            isDark
              ? "bg-red-700 hover:bg-red-600 text-white border-red-600/30 shadow-lg shadow-red-700/20"
              : "bg-red-600 hover:bg-red-700 text-white border-red-400 shadow-sm"
          }
        `}
      >
        DELETE ALL
      </button>
    </div>
  );
}
