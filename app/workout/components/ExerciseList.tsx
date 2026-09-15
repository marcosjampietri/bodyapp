"use client";

import { useState } from "react";
import Link from "next/link";
import { useWorkoutStore } from "../../stores/WorkoutStore";
import { useTheme } from "../../context/ThemeContext";
import {
  Check,
  Circle,
  ChevronUp,
  ChevronDown,
  X,
  Pencil,
  Check as CheckIcon,
} from "lucide-react";

export default function ExerciseList() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { currentWorkout, updateExerciseOrder, removeExercise } =
    useWorkoutStore();
  const [editMode, setEditMode] = useState(false);

  const exercises = currentWorkout?.exercises || [];

  if (!exercises.length) return <div className="space-y-1"></div>;

  const handleRemove = (name: string, id: string) => {
    if (confirm(`Remove "${name}" from this workout?`)) {
      removeExercise(id);
    }
  };

  return (
    <div className="mb-6" data-testid="exercise-list">
      {/* Edit toggle */}
      <div className="flex justify-end mb-2">
        <button
          data-testid="toggle-edit"
          onClick={() => setEditMode((v) => !v)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-sm border transition
            text-[10px] font-black uppercase tracking-wider
            ${
              editMode
                ? isDark
                  ? "bg-orange-600/30 text-orange-300 border-orange-500/50"
                  : "bg-red-50 text-red-700 border-red-300"
                : isDark
                  ? "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  : "bg-white text-zinc-500 border-gray-200 hover:border-gray-300"
            }
          `}
        >
          {editMode ? (
            <>
              <CheckIcon className="w-3 h-3" />
              Done
            </>
          ) : (
            <>
              <Pencil className="w-3 h-3" />
              Reorder
            </>
          )}
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {exercises.map((exercise, index) => {
          const isComplete = exercise.sets.every(
            (s) => Number(s.weight) > 0 && s.reps > 0,
          );
          const reps = exercise.sets.map((s) => s.reps);
          const minReps = Math.min(...reps);
          const maxReps = Math.max(...reps);
          const isFirst = index === 0;
          const isLast = index === exercises.length - 1;

          const cardClass = `
            flex items-center rounded-sm border transition-all shadow-lg shadow-black/20
            ${
              isDark
                ? `bg-linear-to-br from-zinc-900 to-zinc-950 ${
                    isComplete
                      ? "border-green-800/50 bg-linear-to-br from-green-950/20 to-zinc-900"
                      : "border-orange-900/20"
                  }`
                : `bg-white ${
                    isComplete
                      ? "border-green-300 bg-green-50/50"
                      : "border-orange-200"
                  }`
            }
            ${
              editMode
                ? ""
                : isDark
                  ? "hover:border-orange-700/50"
                  : "hover:border-orange-300 hover:shadow-md"
            }
          `;

          const inner = (
            <>
              <div className="shrink-0">
                {isComplete ? (
                  <div
                    data-testid={`status-complete-${exercise._id}`}
                    className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div
                    data-testid={`status-pending-${exercise._id}`}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isDark ? "border-orange-500" : "border-red-400"
                    }`}
                  >
                    <Circle
                      className={`w-4 h-4 ${
                        isDark ? "text-orange-500" : "text-red-500"
                      }`}
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`font-black text-sm uppercase tracking-wider truncate ${
                    isDark ? "text-white" : "text-zinc-800"
                  }`}
                >
                  {exercise.name}
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 flex-wrap">
                  <span>{exercise.sets.length} sets</span>
                  <span>×</span>
                  <span>
                    {minReps}
                    {maxReps !== minReps ? ` - ${maxReps}` : ""} reps
                  </span>
                  <span>•</span>
                  <span className="truncate">
                    {exercise.equipment || "Body"}
                  </span>
                </div>
              </div>
            </>
          );

          return (
            <div
              key={exercise._id}
              data-testid={`exercise-card-${exercise._id}`}
              className={cardClass}
            >
              {editMode ? (
                <div className="flex-1 min-w-0 flex items-center gap-3 p-4">
                  {inner}
                </div>
              ) : (
                <Link
                  href={`/workout/exercise/${exercise.slug}`}
                  className="flex-1 min-w-0 flex items-center gap-3 p-4"
                >
                  {inner}
                </Link>
              )}

              {editMode && (
                <>
                  <div className="flex flex-col shrink-0 gap-0.5">
                    <button
                      onClick={() =>
                        updateExerciseOrder(exercise._id, index - 1)
                      }
                      disabled={isFirst}
                      aria-label={`Move ${exercise.name} up`}
                      className={`
                        w-7 h-6 flex items-center justify-center rounded-sm transition
                        ${
                          isFirst
                            ? "opacity-20 cursor-not-allowed"
                            : isDark
                              ? "text-zinc-500 hover:text-orange-400 hover:bg-zinc-800/50"
                              : "text-zinc-400 hover:text-red-500 hover:bg-red-50"
                        }
                      `}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        updateExerciseOrder(exercise._id, index + 1)
                      }
                      disabled={isLast}
                      aria-label={`Move ${exercise.name} down`}
                      className={`
                        w-7 h-6 flex items-center justify-center rounded-sm transition
                        ${
                          isLast
                            ? "opacity-20 cursor-not-allowed"
                            : isDark
                              ? "text-zinc-500 hover:text-orange-400 hover:bg-zinc-800/50"
                              : "text-zinc-400 hover:text-red-500 hover:bg-red-50"
                        }
                      `}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(exercise.name, exercise._id)}
                    aria-label={`Remove ${exercise.name}`}
                    className={`
                      shrink-0 w-9 h-full flex items-center justify-center rounded-r-sm transition
                      ${
                        isDark
                          ? "text-zinc-600 hover:text-red-400 hover:bg-red-950/30"
                          : "text-zinc-300 hover:text-red-500 hover:bg-red-50"
                      }
                    `}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
