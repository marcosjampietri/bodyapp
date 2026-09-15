"use client";

import { useState } from "react";
import { useWorkoutStore } from "../../../../stores/WorkoutStore";
import { useTheme } from "../../../../context/ThemeContext";
import { SlidersHorizontal, Plus, Minus } from "lucide-react";

interface SetCounterBarProps {
  exerciseId: string;
}

export default function SetCounterBar({ exerciseId }: SetCounterBarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { currentWorkout, addSet, removeSet, updateExerciseSettings } =
    useWorkoutStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const exercise = currentWorkout?.exercises.find((e) => e._id === exerciseId);
  if (!exercise) return null;

  const sets = exercise.sets;
  const splitWeight = exercise.settings?.splitWeight || false;
  const barEnabled = exercise.settings?.barEnabled || false;
  const barWeight = exercise.settings?.barWeight ?? 20;

  const isSetComplete = (s: any) => Number(s.weight) > 0 && s.reps > 0;
  const isSetFilled = (s: any) => Number(s.weight) > 0 || s.reps > 0;
  const completedCount = sets.filter(isSetComplete).length;
  const progressPercent =
    sets.length > 0 ? Math.round((completedCount / sets.length) * 100) : 0;

  const handleAdd = () => addSet(exercise._id);

  const handleRemove = () => {
    if (sets.length <= 1) return;
    const last = sets[sets.length - 1];
    if (isSetFilled(last)) {
      if (!confirm(`Set ${sets.length} has data. Remove it anyway?`)) return;
    }
    removeSet(exercise._id, last.id);
  };

  const onClass = isDark
    ? "bg-orange-600/30 text-orange-300 border-orange-500/50"
    : "bg-red-50 text-red-700 border-red-300";
  const offClass = isDark
    ? "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
    : "bg-white text-gray-400 border-gray-200 hover:border-gray-300";

  const rowBorder = isDark ? "border-orange-900/20" : "border-red-200";
  const labelClass = `text-[10px] font-black uppercase tracking-widest shrink-0 ${
    isDark ? "text-zinc-500" : "text-zinc-400"
  }`;

  return (
    <div className="space-y-3 mb-4">
      {/* ============ COMMAND BAR ============ */}
      <div className="flex">
        <div
          className={` flex-1
          relative rounded-sm border-2 overflow-hidden
          ${
            isDark
              ? "bg-linear-to-r from-orange-950/50 via-red-950/50 to-orange-950/50 border-orange-600/60 shadow-[0_0_30px_-5px_rgb(251_146_60/0.4)]"
              : "bg-linear-to-r from-red-50 via-orange-50 to-red-50 border-red-300 shadow-md"
          }
        `}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-0.5 ${
              isDark
                ? "bg-linear-to-r from-transparent via-orange-500 to-transparent"
                : "bg-linear-to-r from-transparent via-red-500 to-transparent"
            }`}
          />

          <div className="flex items-center gap-1.5 px-2 py-2">
            {/* Minus */}
            <button
              onClick={handleRemove}
              disabled={sets.length <= 1}
              aria-label="Remove last set"
              className={`
              w-9 h-10 rounded-sm flex items-center justify-center transition-all shrink-0
              ${
                sets.length <= 1
                  ? "opacity-20 cursor-not-allowed"
                  : isDark
                    ? "bg-red-950/60 border border-red-700/60 text-red-400 hover:bg-red-900/60 hover:border-red-600"
                    : "bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400"
              }
            `}
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Counter */}
            <div className="flex-1 flex items-center justify-center gap-3">
              <div
                className={`h-8 w-px ${
                  isDark ? "bg-orange-700/50" : "bg-red-300"
                }`}
              />
              <div className="text-center">
                <p
                  className={`text-[8px] font-black uppercase tracking-[0.3em] ${
                    isDark ? "text-orange-500/70" : "text-red-400"
                  }`}
                >
                  Sets Done
                </p>
                <p
                  className={`text-xl font-black font-michroma leading-none mt-0.5 ${
                    isDark
                      ? "text-orange-300 drop-shadow-[0_0_15px_rgba(251,146,60,0.4)]"
                      : "text-red-600"
                  }`}
                >
                  <span>{String(completedCount).padStart(2, "0")}</span>
                  <span
                    className={`text-sm opacity-50 ${
                      isDark ? "text-orange-400" : "text-red-400"
                    }`}
                  >
                    /{String(sets.length).padStart(2, "0")}
                  </span>
                </p>
              </div>
              <div
                className={`h-8 w-px ${
                  isDark ? "bg-orange-700/50" : "bg-red-300"
                }`}
              />
            </div>

            {/* Plus */}
            <button
              onClick={handleAdd}
              aria-label="Add set"
              className={`
              w-9 h-10 rounded-sm flex items-center justify-center transition-all shrink-0
              ${
                isDark
                  ? "bg-linear-to-br from-orange-600 to-red-600 text-white shadow-lg shadow-orange-600/40 hover:from-orange-500 hover:to-red-500"
                  : "bg-red-600 text-white shadow-sm shadow-red-300 hover:bg-red-700"
              }
            `}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div
            className={`h-1 ${isDark ? "bg-zinc-900" : "bg-gray-200"}`}
            aria-hidden
          >
            <div
              className={`h-full transition-all duration-300 ${
                isDark
                  ? "bg-linear-to-r from-green-500 to-green-400"
                  : "bg-green-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 h-0.5 ${
              isDark
                ? "bg-linear-to-r from-transparent via-red-600 to-transparent"
                : "bg-linear-to-r from-transparent via-red-400 to-transparent"
            }`}
          />
        </div>

        {/* Gear */}
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          aria-label="Weight settings"
          className={`
              w-10 h-10 mx-2 my-2.5 rounded-sm flex items-center justify-center transition-all shrink-0 border
              ${
                settingsOpen
                  ? isDark
                    ? "bg-orange-600/40 border-orange-500/60 text-orange-300"
                    : "bg-red-50 border-red-400 text-red-600"
                  : isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    : "bg-white border-gray-200 text-zinc-500 hover:border-gray-300"
              }
            `}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
      {/* ============ SETTINGS PANEL ============ */}
      {settingsOpen && (
        <div
          className={`rounded-sm border ${rowBorder} ${
            isDark ? "bg-zinc-900/30" : "bg-red-50/30"
          }`}
        >
          <div className="flex items-center justify-between gap-3 p-3">
            <span className={labelClass}>Weight Mode</span>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                onClick={() =>
                  updateExerciseSettings(exercise._id, {
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
                  updateExerciseSettings(exercise._id, {
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
                      updateExerciseSettings(exercise._id, {
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
