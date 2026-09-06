"use client";

import { useParams } from "next/navigation";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import { ThemeToggle } from "@/app/components/theme/ThemeToggle";
import { ArrowLeft, Settings, Plus } from "lucide-react";
import SetInput from "./components/SetInput";
import SettingsModal from "./components/SettingsModal";
import Stopwatch from "./components/Stopwatch";
import History from "./components/History";
import Controls from "./components/Controls";

export default function ExercisePage() {
  const params = useParams();
  const exerciseId = params.name as string;
  const { currentWorkout, addSet, removeSet } = useWorkoutStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const exercise = currentWorkout?.exercises.find((e) => e.id === exerciseId);

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
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`w-10 h-10 rounded-sm flex items-center justify-center transition ${
                isDark
                  ? "bg-zinc-900 border border-orange-900/30 hover:border-orange-700/50"
                  : "bg-white border border-orange-200 hover:border-orange-300"
              }`}
            >
              <Settings
                className={`w-5 h-5 ${isDark ? "text-orange-400" : "text-orange-600"}`}
              />
            </button>
          </div>
        </div>

        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          exerciseId={exercise.id}
        />

        <SetInput exerciseId={exercise.id} />

        {/* Add Set – dashed line */}
        <button
          onClick={() => addSet(exercise._id)}
          className={`
            w-full py-3 rounded-sm border-2 border-dashed transition flex items-center justify-center gap-2
            ${
              isDark
                ? "border-orange-600 text-orange-400 "
                : "border-red-500 text-red-500 "
            }
          `}
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wider">
            Add Set
          </span>
        </button>
        <button
          onClick={() => {
            if (exercise.sets.length > 1) {
              const lastSet = exercise.sets[exercise.sets.length - 1];
              removeSet(exercise._id, lastSet.id);
            }
          }}
          className={`
            w-full py-3 rounded-sm border-2 border-dashed transition flex items-center justify-center gap-2
            ${
              isDark
                ? "border-orange-600 text-orange-400 "
                : "border-red-500 text-red-500 "
            }
          `}
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wider">
            Remove Set
          </span>
        </button>

        {/* <Controls exerciseId={exercise._id} /> */}

        {/* Stopwatch – standalone rest timer */}
        <Stopwatch />

        {/* History */}
        <History exerciseID={exercise._id} />
      </div>
    </div>
  );
}
