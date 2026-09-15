"use client";

import { ThemeToggle } from "@/app/components/theme/ThemeToggle";
import { useTheme } from "@/app/context/ThemeContext";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import History from "./components/History";
import SetInput from "./components/SetInput";
import SetCounterBar from "./components/SetCounterBar";
import Stopwatch from "./components/Stopwatch";

export default function ExercisePage() {
  const params = useParams();
  const exerciseSlug = params.slug as string;
  const { currentWorkout } = useWorkoutStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const exercise = currentWorkout?.exercises.find(
    (e) => e.slug === exerciseSlug,
  );

  if (!exercise) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"} p-4`}>
        <p className={isDark ? "text-white" : "text-zinc-800"}>
          Exercise not found
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-md mx-auto w-full px-4 py-6">
        {/* Header */}
        <div
          className={`flex items-center gap-3 mb-6 pb-4 border-b ${
            isDark ? "border-orange-900/20" : "border-orange-200"
          }`}
        >
          <Link
            href="/workout"
            className={`shrink-0 flex items-center gap-2 text-sm font-medium transition ${
              isDark
                ? "text-zinc-400 hover:text-white"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <h2
            className={`flex-1 text-sm font-black uppercase tracking-wider text-center truncate ${
              isDark ? "text-white" : "text-zinc-800"
            }`}
          >
            {exercise.name}
          </h2>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
          </div>
        </div>

        <SetCounterBar exerciseId={exercise._id} />

        <SetInput exerciseId={exercise._id} />

        <Stopwatch />

        <History exerciseID={exercise._id} />
      </div>
    </div>
  );
}
