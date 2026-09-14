"use client";

import { useState } from "react";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";
import { useTheme } from "@/app/context/ThemeContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import dayjs from "dayjs";

interface HistoryProps {
  exerciseID: string;
}

export default function History({ exerciseID }: HistoryProps) {
  const { workoutHistory } = useWorkoutStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const occurrences = workoutHistory
    .filter((workout) => workout.exercises.some((ex) => ex._id === exerciseID))
    .map((workout) => {
      const exercise = workout.exercises.find((ex) => ex._id === exerciseID);
      return {
        date: workout.date,
        exercise,
        workoutName: workout.name,
      };
    })
    .reverse();

  const toggleExpand = (date: string) => {
    setExpandedItems((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date],
    );
  };

  if (occurrences.length === 0) {
    return (
      <div
        className={`text-center py-4 text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
      >
        No history for this exercise yet
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div
        className={`flex justify-between items-center mb-3 border-b pb-2 ${
          isDark ? "border-orange-900/20" : "border-red-200"
        }`}
      >
        <h3
          className={`text-xs font-black uppercase tracking-wider ${
            isDark ? "text-orange-400" : "text-red-600"
          }`}
        >
          History ({occurrences.length})
        </h3>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {occurrences.map((item, index) => {
          const isExpanded = expandedItems.includes(item.date.toString());
          const exercise = item.exercise;
          if (!exercise) return null;

          const reps = exercise.sets.map((s) => s.reps);
          const minReps = Math.min(...reps);
          const maxReps = Math.max(...reps);

          return (
            <div
              key={index}
              className={`rounded-sm border ${
                isDark
                  ? "bg-zinc-900/50 border-orange-900/20"
                  : "bg-red-50/50 border-red-200"
              }`}
            >
              <button
                onClick={() => toggleExpand(item.date.toString())}
                className="w-full flex items-center justify-between p-3 hover:bg-opacity-20 transition"
              >
                <span
                  className={`text-xs font-bold ${isDark ? "text-white" : "text-zinc-800"}`}
                >
                  {dayjs(item.date).format("DD/MM/YY")}
                </span>
                <span
                  className={`text-sm font-medium flex-1 ml-3 text-left truncate ${
                    isDark ? "text-white" : "text-zinc-800"
                  }`}
                >
                  {exercise.name}
                </span>
                <span
                  className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  {exercise.sets.length} sets
                </span>
                <span
                  className={`text-xs mx-2 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  {minReps}
                  {maxReps !== minReps ? ` - ${maxReps}` : ""}
                </span>
                {isExpanded ? (
                  <ChevronUp
                    className={`w-4 h-4 ${isDark ? "text-orange-400" : "text-red-500"}`}
                  />
                ) : (
                  <ChevronDown
                    className={`w-4 h-4 ${isDark ? "text-orange-400" : "text-red-500"}`}
                  />
                )}
              </button>

              {isExpanded && (
                <div className="p-3 pt-0 border-t border-gray-600/30 space-y-1">
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className="flex items-center justify-between text-sm py-1 border-b border-gray-600/20 last:border-b-0"
                    >
                      <span
                        className={`w-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                      >
                        {setIndex + 1}
                      </span>
                      <div className="flex items-center gap-2 flex-1 ml-2">
                        <span
                          className={isDark ? "text-white" : "text-zinc-800"}
                        >
                          {set.reps}
                        </span>
                        <span
                          className={isDark ? "text-zinc-500" : "text-zinc-400"}
                        >
                          ×
                        </span>
                        <span
                          className={isDark ? "text-white" : "text-zinc-800"}
                        >
                          {set.weight} KG
                        </span>
                      </div>
                      {set.rpe && (
                        <span
                          className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                        >
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
