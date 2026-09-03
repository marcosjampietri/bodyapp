"use client";

import { useState } from "react";
import { useWorkoutStore } from "../../../stores/WorkoutStore";
import dayjs from "dayjs";

interface HistoryProps {
  exerciseName: string;
}

export default function ExerciseHistory({ exerciseName }: HistoryProps) {
  const { workoutHistory } = useWorkoutStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Find all workouts that contain this exercise
  const exerciseOccurrences = workoutHistory
    .filter((workout) =>
      workout.exercises.some((ex) => ex.name === exerciseName),
    )
    .map((workout) => {
      const exerciseItem = workout.exercises.find(
        (ex) => ex.name === exerciseName,
      );
      return {
        date: workout.date,
        exercise: exerciseItem,
        workoutName: workout.name,
      };
    })
    .reverse();

  if (exerciseOccurrences.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400 text-sm">
        No history for this exercise yet
      </div>
    );
  }

  const toggleExpand = (date: string) => {
    setExpandedItems((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date],
    );
  };

  return (
    <div className="mt-4">
      <h3 className="text-white text-sm font-bold uppercase mb-2">
        History ({exerciseOccurrences.length})
      </h3>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {exerciseOccurrences.map((item, index) => {
          const isExpanded = expandedItems.includes(item.date.toString());
          const exercise = item.exercise;
          if (!exercise) return null;

          const reps = exercise.sets.map((s) => s.reps);
          const minReps = Math.min(...reps);
          const maxReps = Math.max(...reps);

          return (
            <div
              key={index}
              className="bg-gray-800 rounded border border-gray-600"
            >
              {/* Header - click to expand */}
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-700"
                onClick={() => toggleExpand(item.date.toString())}
              >
                <span className="text-white text-xs">
                  {dayjs(item.date).format("DD/MM/YY")}
                </span>
                <span className="text-white text-sm font-medium flex-1 ml-2">
                  {exercise.name}
                </span>
                <span className="text-gray-400 text-xs">
                  {exercise.sets.length} sets
                </span>
                <span className="text-gray-400 text-xs ml-2">
                  {minReps}
                  {maxReps !== minReps ? ` - ${maxReps}` : ""}
                </span>
                <span className="text-gray-400 text-xs ml-2">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>

              {/* Expanded sets */}
              {isExpanded && (
                <div className="p-2 border-t border-gray-600 space-y-1">
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-400 w-6">{setIndex + 1}</span>
                      <div className="flex items-center gap-2 flex-1 ml-2">
                        <span className="text-white">{set.reps}</span>
                        <span className="text-gray-400">×</span>
                        <span className="text-white">{set.weight} KG</span>
                      </div>
                      {set.rpe && (
                        <span className="text-gray-400 text-xs">
                          RPE {set.rpe}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
