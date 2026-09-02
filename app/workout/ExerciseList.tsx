"use client";

import Link from "next/link";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";
import { useState } from "react";

export default function ExerciseList() {
  const { currentWorkout, completeExercise } = useWorkoutStore();
  const [editModalOpen, setEditModalOpen] = useState<string | null>(null);

  const exercises = currentWorkout?.exercises || [];

  // Calculate completion status for each exercise
  const getExerciseStatus = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise) return { completed: false, hasData: false };

    const hasData = exercise.sets.some(
      (s) => s.reps > 0 && Number(s.weight) > 0,
    );
    const allComplete = exercise.sets.every(
      (s) => s.reps > 0 && Number(s.weight) > 0,
    );

    return { completed: allComplete, hasData };
  };

  return (
    <div className="space-y-1">
      {exercises.map((exercise, index) => {
        const { completed, hasData } = getExerciseStatus(exercise.id);
        const reps = exercise.sets.map((s) => s.reps);
        const minReps = Math.min(...reps);
        const maxReps = Math.max(...reps);

        return (
          <Link
            key={exercise.id}
            href={`/workout/exercise/${exercise.id}`}
            className={`
              flex items-center justify-between p-3 rounded-md border border-gray-600
              ${completed ? "bg-green-900/30 border-green-500" : "bg-gray-800/50"}
              ${hasData && !completed ? "border-yellow-500/50" : ""}
              hover:bg-gray-700/50 transition
            `}
          >
            {/* Status Icon */}
            <div className="w-10 h-10 flex items-center justify-center border border-gray-500 rounded">
              {completed ? (
                <span className="text-green-400 text-lg">✓</span>
              ) : hasData ? (
                <span className="text-yellow-400 text-lg">◉</span>
              ) : (
                <span className="text-gray-500 text-lg">○</span>
              )}
            </div>

            {/* Exercise Name */}
            <span className="flex-1 ml-3 text-white text-sm font-medium truncate">
              {exercise.name}
            </span>

            {/* Sets Count */}
            <span className="text-white/70 text-sm mx-1">
              {exercise.sets.length}
            </span>
            <span className="text-white/40 text-xs">×</span>

            {/* Reps Range */}
            <span className="text-white/70 text-sm w-16 text-right">
              {minReps}
              {maxReps !== minReps ? ` - ${maxReps}` : ""}
            </span>

            {/* Arrow */}
            <span className="text-cyan-400 ml-2">›</span>
          </Link>
        );
      })}
    </div>
  );
}
