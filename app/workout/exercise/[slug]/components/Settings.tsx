"use client";

import { useState } from "react";
import { useWorkoutStore } from "../../../../stores/WorkoutStore";
import { useTheme } from "../../../../context/ThemeContext";
import { SlidersHorizontal } from "lucide-react";

interface WeightSettingsProps {
  exerciseId: string;
}

export default function WeightSettings({ exerciseId }: WeightSettingsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { currentWorkout, updateExerciseSettings } = useWorkoutStore();
  const [open, setOpen] = useState(false);

  const exercise = currentWorkout?.exercises.find((e) => e._id === exerciseId);
  if (!exercise) return null;

  const splitWeight = exercise.settings?.splitWeight || false;
  const barEnabled = exercise.settings?.barEnabled || false;
  const barWeight = exercise.settings?.barWeight ?? 20;

  const onClass = isDark
    ? "bg-orange-600/30 text-orange-300 border-orange-500/50"
    : "bg-red-50 text-red-700 border-red-300";
  const offClass = isDark
    ? "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
    : "bg-white text-gray-400 border-gray-200 hover:border-gray-300";

  const rowBorder = isDark ? "border-orange-900/20" : "border-red-200";
  const rowBg = isDark ? "bg-zinc-900/50" : "bg-red-50/50";
  const labelClass = `text-[10px] font-black uppercase tracking-widest shrink-0 ${
    isDark ? "text-zinc-500" : "text-zinc-400"
  }`;

  return (
    <div className={`rounded-sm border mb-6 ${rowBorder}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-3 ${rowBg}`}>
        <span
          className={`text-xs font-black uppercase tracking-wider ${
            isDark ? "text-white" : "text-zinc-800"
          }`}
        >
          Exercise Options
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Weight settings"
          className={`w-8 h-8 rounded-sm flex items-center justify-center transition ${
            open
              ? onClass
              : isDark
                ? "bg-zinc-900 text-zinc-400 border border-zinc-800"
                : "bg-white text-zinc-500 border border-gray-200"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className={`border-t ${rowBorder}`}>
          <div className="flex items-center justify-between gap-3 p-3">
            <span className={labelClass}>Weight Mode</span>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                onClick={() =>
                  updateExerciseSettings(exerciseId, {
                    splitWeight: !splitWeight,
                  })
                }
                className={`px-3 py-1.5 rounded-sm border text-[11px] font-black uppercase tracking-wider transition ${
                  splitWeight ? onClass : offClass
                }`}
              >
                Split ×2
              </button>

              <button
                onClick={() =>
                  updateExerciseSettings(exerciseId, {
                    barEnabled: !barEnabled,
                  })
                }
                className={`px-3 py-1.5 rounded-sm border text-[11px] font-black uppercase tracking-wider transition ${
                  barEnabled ? onClass : offClass
                }`}
              >
                Bar
              </button>

              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-sm border transition ${
                  barEnabled
                    ? isDark
                      ? "bg-zinc-800 border-orange-500/40"
                      : "bg-white border-red-300"
                    : isDark
                      ? "bg-zinc-900/50 border-zinc-800 opacity-40"
                      : "bg-gray-50 border-gray-200 opacity-40"
                }`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={barWeight}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || /^\d*$/.test(v)) {
                      updateExerciseSettings(exerciseId, {
                        barWeight: v === "" ? 0 : parseInt(v),
                      });
                    }
                  }}
                  disabled={!barEnabled}
                  className={`w-8 text-center text-sm font-black font-michroma bg-transparent focus:outline-none ${
                    isDark ? "text-white" : "text-zinc-800"
                  } ${!barEnabled ? "cursor-not-allowed" : ""}`}
                />
                <span
                  className={`text-[10px] font-bold ${
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  kg
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
