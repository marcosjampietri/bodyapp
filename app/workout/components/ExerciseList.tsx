"use client";

import Link from "next/link";
import { useWorkoutStore } from "../../stores/WorkoutStore";
import { useTheme } from "../../context/ThemeContext";
import { Badge } from "../../components/ui/Badge";
import { Check, Circle } from "lucide-react";

export default function ExerciseList() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { currentWorkout } = useWorkoutStore();

  const exercises = currentWorkout?.exercises || [];

  if (!exercises.length) return <div className="space-y-1"></div>;

  return (
    <div className="space-y-3 mb-6">
      {exercises.map((exercise) => {
        const isComplete = exercise.sets.every(
          (s) => Number(s.weight) > 0 && s.reps > 0,
        );
        const reps = exercise.sets.map((s) => s.reps);
        const minReps = Math.min(...reps);
        const maxReps = Math.max(...reps);

        return (
          <Link
            key={exercise.id}
            href={`/workout/exercise/${exercise.id}`}
            className={`
              block rounded-sm p-4 border transition-all shadow-lg shadow-black/20
              ${
                isDark
                  ? `bg-linear-to-br from-zinc-900 to-zinc-950 hover:border-orange-700/50 ${
                      isComplete
                        ? "border-green-800/50 bg-linear-to-br from-green-950/20 to-zinc-900"
                        : "border-orange-900/20"
                    }`
                  : `bg-white hover:border-orange-300 hover:shadow-md ${
                      isComplete
                        ? "border-green-300 bg-green-50/50"
                        : "border-orange-200"
                    }`
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              <div className="shrink-0">
                {isComplete ? (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-orange-500 flex items-center justify-center">
                    <Circle className="w-4 h-4 text-orange-500" />
                  </div>
                )}
              </div>

              {/* Exercise Info */}
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
                  <span>{exercise.equipment || "Body"}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 ml-2">
                {isComplete ? (
                  <Badge variant="success" className="whitespace-nowrap">
                    ✓ Done
                  </Badge>
                ) : (
                  <Badge variant="default" className="whitespace-nowrap">
                    Attack
                  </Badge>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
