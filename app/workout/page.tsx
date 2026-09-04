"use client";

import { useWorkoutStore } from "../stores/WorkoutStore";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import {
  Shield,
  User,
  Flame,
  Target,
  AlertTriangle,
  Plus,
  ChevronRight,
  Check,
  Circle,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import ExerciseList from "./components/ExerciseList";
import WorkoutControls from "./components/WorkoutControls";
import { useRouter } from "next/navigation";

export default function WorkoutPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { currentWorkout } = useWorkoutStore();

  const router = useRouter();

  const exercises = currentWorkout?.exercises || [];
  const hasExercises = exercises.length > 0;

  const completed = exercises.filter((ex) =>
    ex.sets.every((s) => Number(s.weight) > 0 && s.reps > 0),
  ).length;
  const total = exercises.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-md mx-auto w-full px-4 py-6">
        {/* Header */}
        <div
          className={`flex justify-between items-center mb-8 border-b pb-4 ${
            isDark ? "border-orange-900/20" : "border-orange-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                isDark
                  ? "bg-linear-to-br from-red-600 to-orange-500 shadow-lg shadow-orange-600/30"
                  : "bg-red-600 shadow-md shadow-orange-200"
              }`}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1
                className={`text-xl font-black tracking-tight ${
                  isDark
                    ? "bg-linear-to-r from-red-500 to-orange-400 bg-clip-text text-transparent"
                    : "text-red-600"
                }`}
              >
                IRON
              </h1>
              <p className="text-[10px] text-zinc-500 tracking-widest uppercase">
                Pain is progress
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              className={`w-10 h-10 rounded-sm flex items-center justify-center transition ${
                isDark
                  ? "bg-linear-to-br from-zinc-900 to-zinc-950 border border-orange-900/30 hover:from-orange-950 hover:to-zinc-900"
                  : "bg-white border border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              }`}
            >
              <User
                className={`w-5 h-5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
              />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card variant="stats">
            <div className="flex items-center gap-2 mb-1">
              <Flame
                className={`w-4 h-4 ${
                  isDark
                    ? "text-orange-500 drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]"
                    : "text-orange-500"
                }`}
              />
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                Streak
              </p>
            </div>
            <p
              className={`text-2xl font-black ${
                isDark
                  ? "bg-linear-to-r from-red-500 to-orange-400 bg-clip-text text-transparent"
                  : "text-red-600"
              }`}
            >
              14
            </p>
            <p className="text-[10px] text-zinc-600 uppercase">Days of war</p>
          </Card>

          <Card variant="stats">
            <div className="flex items-center gap-2 mb-1">
              <Target
                className={`w-4 h-4 ${
                  isDark
                    ? "text-orange-500 drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]"
                    : "text-orange-500"
                }`}
              />
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                Volume
              </p>
            </div>
            <p
              className={`text-2xl font-black ${
                isDark
                  ? "bg-linear-to-r from-red-500 to-orange-400 bg-clip-text text-transparent"
                  : "text-red-600"
              }`}
            >
              18.4k
            </p>
            <p className="text-[10px] text-zinc-600 uppercase">Total kg</p>
          </Card>
        </div>

        {/* Progress Banner */}
        <div
          className={`p-3 mb-6 flex items-center gap-3 rounded-sm border ${
            isDark
              ? "bg-linear-to-r from-orange-950/70 via-red-900/40 to-orange-950/70 border-orange-800/30 shadow-lg shadow-orange-900/20"
              : "bg-orange-50 border-orange-200 shadow-sm"
          }`}
        >
          <AlertTriangle
            className={`w-5 h-5 shrink-0 ${
              isDark
                ? "text-orange-500 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]"
                : "text-orange-500"
            }`}
          />
          <p
            className={`text-xs font-medium uppercase tracking-wider ${
              isDark
                ? "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]"
                : "text-orange-600"
            }`}
          >
            {hasExercises ? "Destroy every set" : "Build your workout"}
          </p>
          <span
            className={`ml-auto text-xs font-black ${
              isDark
                ? "text-orange-500 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]"
                : "text-orange-500"
            }`}
          >
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        {hasExercises && (
          <div className="mb-6">
            <ProgressBar value={progress} />
            <div className="flex justify-between mt-1">
              <span
                className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
              >
                {completed} of {total} exercises
              </span>
              <span
                className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
              >
                {progress}% complete
              </span>
            </div>
          </div>
        )}

        {/* Exercise List */}
        <ExerciseList />

        {/* Add Exercise */}
        <div className="my-6">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="flex items-center justify-center gap-2"
            onClick={() => {
              router.push("/build");
            }}
          >
            <Plus className="w-4 h-4" />
            {hasExercises ? "Add Exercise" : "Build New Workout"}
          </Button>
        </div>

        {/* Controls */}
        <WorkoutControls />
      </div>
    </div>
  );
}
