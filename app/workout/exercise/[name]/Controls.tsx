"use client";

import { useRouter } from "next/navigation";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";

interface ControlsProps {
  exerciseId: string;
}

export default function Controls({ exerciseId }: ControlsProps) {
  const router = useRouter();
  const { currentWorkout, addSet, removeSet, removeExercise } =
    useWorkoutStore();

  const exercise = currentWorkout?.exercises.find((e) => e.id === exerciseId);
  if (!exercise) return null;

  return (
    <div className="flex flex-row justify-center gap-4 mt-4">
      {/* Add Set */}
      <button
        onClick={() => addSet(exercise.id)}
        className="bg-green-600 px-6 py-3 rounded w-28 border border-gray-500"
      >
        <span className="text-white text-xs font-bold">ADD SET</span>
      </button>

      {/* Delete Set */}
      <button
        onClick={() => {
          if (exercise.sets.length > 1) {
            const lastSet = exercise.sets[exercise.sets.length - 1];
            removeSet(exercise.id, lastSet.id);
          }
        }}
        className="bg-red-600 px-6 py-3 rounded w-28 border border-gray-500"
      >
        <span className="text-white text-xs font-bold">DELETE SET</span>
      </button>

      {/* Delete All */}
      <button
        onClick={() => {
          removeExercise(exercise.id);
          router.back();
        }}
        className="bg-red-600 px-6 py-3 rounded w-28 border border-gray-500"
      >
        <span className="text-white text-xs font-bold">DELETE ALL</span>
      </button>
    </div>
  );
}
