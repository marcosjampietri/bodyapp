"use client";

import { useWorkoutStore } from "@/app/stores/WorkoutStore";
import { useTheme } from "@/app/context/ThemeContext";
import { Check, Circle, X } from "lucide-react";

interface SetInputProps {
  exerciseId: string;
}

export default function SetInput({ exerciseId }: SetInputProps) {
  const { currentWorkout, updateSet } = useWorkoutStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const exercise = currentWorkout?.exercises.find((e) => e.id === exerciseId);
  if (!exercise) return null;

  const settings = exercise.settings || { splitWeight: false, barWeight: 0 };
  const { splitWeight, barWeight } = settings;
  const hasSettings = splitWeight || Number(barWeight) > 0;

  const isSetComplete = (set: any) =>
    Number(set.weight) > 0 && Number(set.reps) > 0;

  const getFirstIncompleteIndex = () => {
    return exercise.sets.findIndex((s) => !isSetComplete(s));
  };

  const getSetState = (index: number) => {
    const set = exercise.sets[index];
    if (isSetComplete(set)) return "complete";
    if (index === getFirstIncompleteIndex()) return "editable";
    return "locked";
  };

  const handleUpdate = (
    setId: string,
    data: { weight?: number | string; reps?: number; rpe?: number },
  ) => {
    updateSet(exercise.id, setId, data);
  };

  return (
    <div className="space-y-2 mb-4  max-h-125 overflow-y-scroll">
      {exercise.sets.map((set, index) => {
        const state = getSetState(index);
        const isEditable = state === "editable";
        const isComplete = state === "complete";
        const isLocked = state === "locked";

        const valueReps = set.reps?.toString() || "";
        const valueWeight = set.weight?.toString() || "";

        const totalWeight =
          Number(set.weight) * (splitWeight ? 2 : 1) + (barWeight || 0);
        const showTotal = splitWeight || (barWeight && barWeight > 0);

        return (
          <div
            key={set.id}
            className={`
              grid grid-cols-18 gap-1 items-center p-3 rounded-sm border transition-all shadow-lg
              ${
                isDark
                  ? `bg-linear-to-br from-zinc-900 to-zinc-950 ${
                      isComplete
                        ? "border-green-800/50 bg-linear-to-br from-green-950/30 to-zinc-900"
                        : isEditable
                          ? "border-orange-500/70 bg-linear-to-br from-orange-950/30 to-zinc-900"
                          : "border-zinc-800/30 opacity-40 bg-zinc-900/50"
                    }`
                  : `bg-white ${
                      isComplete
                        ? "border-green-300 bg-green-50/60"
                        : isEditable
                          ? "border-red-400 bg-red-50/40 shadow-md shadow-red-200/50"
                          : "border-gray-200 opacity-40 bg-gray-50"
                    }`
              }
            `}
          >
            {/* Set Number */}
            <div className="col-span-1">
              <span
                className={`text-xs font-black ${
                  isDark
                    ? isComplete
                      ? "text-green-400"
                      : isEditable
                        ? "text-orange-400"
                        : "text-zinc-600"
                    : isComplete
                      ? "text-green-600"
                      : isEditable
                        ? "text-red-600"
                        : "text-zinc-400"
                }`}
              >
                {index + 1}
              </span>
            </div>

            {/* Reps Input */}
            <div className={`${hasSettings ? "col-span-4" : "col-span-6"}`}>
              <input
                type="text"
                value={valueReps}
                inputMode="numeric"
                maxLength={5}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) {
                    handleUpdate(set.id, {
                      reps: val === "" ? 0 : parseInt(val),
                    });
                  }
                }}
                onBlur={() => {
                  handleUpdate(set.id, { reps: parseInt(valueReps) || 0 });
                }}
                placeholder={isLocked ? "—" : "Reps"}
                disabled={isLocked}
                className={`
                  w-full px-1 py-2 text-center text-sm font-black rounded-sm
                  font-michroma
                  ${
                    isDark
                      ? `bg-zinc-800 text-white border ${
                          isComplete
                            ? "border-green-500/50"
                            : isEditable
                              ? "border-orange-500/50"
                              : "border-zinc-700/30"
                        }`
                      : `bg-gray-50 text-zinc-800 border ${
                          isComplete
                            ? "border-green-300"
                            : isEditable
                              ? "border-red-300"
                              : "border-gray-200"
                        }`
                  }
                  ${isLocked ? "opacity-50 cursor-not-allowed" : ""}
                  focus:outline-none focus:ring-2 focus:ring-red-400
                `}
              />
            </div>

            {/* × */}
            <div className="col-span-1 flex justify-center">
              <span
                className={`text-sm font-bold ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
              >
                ×
              </span>
            </div>

            {/* Weight Input + Total */}
            <div className={`${hasSettings ? "col-span-9" : "col-span-6"}`}>
              <div
                className={`
                  flex items-center rounded-sm overflow-hidden
                  ${
                    isDark
                      ? "bg-zinc-800 border border-zinc-700 focus-within:border-orange-500"
                      : "bg-gray-50 border border-gray-200 focus-within:border-red-400"
                  }
                  focus-within:ring-2 focus-within:ring-red-400
                `}
              >
                <input
                  type="text"
                  value={valueWeight}
                  inputMode="numeric"
                  maxLength={valueWeight.includes(".") ? 5 : 4}
                  onChange={(e) => {
                    const input = e.target.value;

                    if (input === "") {
                      handleUpdate(set.id, { weight: 0 });
                      return;
                    }

                    if (!/^[\d.]*$/.test(input)) return;
                    if ((input.match(/\./g) || []).length > 1) return;

                    const decimalIndex = input.indexOf(".");
                    if (decimalIndex !== -1 && input.length - decimalIndex > 3)
                      return;

                    const dot = input.endsWith(".");

                    handleUpdate(set.id, {
                      weight: dot ? input : parseFloat(input) || 0,
                    });
                  }}
                  onBlur={() => {
                    handleUpdate(set.id, {
                      weight: parseFloat(valueWeight) || 0,
                    });
                  }}
                  placeholder={isLocked ? "—" : "Weight"}
                  disabled={isLocked}
                  className={`
                    ${hasSettings ? "w-[85.5]" : "w-[127.3]"}
                     px-1 py-2 text-center text-sm font-black
                    font-michroma
                    bg-transparent
                    ${isDark ? "text-white" : "text-zinc-800"}
                    focus:outline-none
                    ${isLocked ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                />

                <div className="h-6 w-px bg-gray-400/30 shrink-0" />

                {/* WITH = w-[125px] */}
                <div className="flex w-31.25 items-center gap-0.5 px-1 justify-between">
                  <div className="flex flex-col">
                    {splitWeight && (
                      <span
                        className={`text-[10px] font-michroma  ${isDark ? "text-orange-400" : "text-red-500"}`}
                      >
                        ×2
                      </span>
                    )}
                    {Number(barWeight) > 0 && (
                      <span
                        className={`text-[10px] font-michroma ${isDark ? "text-orange-400" : "text-red-500"}`}
                      >
                        +{barWeight}
                      </span>
                    )}
                  </div>
                  {showTotal && (
                    <div
                      className={`text-sm font-black font-michroma truncate ${
                        isDark ? "text-orange-400" : "text-red-600"
                      }`}
                    >
                      {" "}
                      = {totalWeight}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* kg */}
            <div className="col-span-1 flex justify-center">
              <span
                className={`text-[10px] font-bold ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                KG
              </span>
            </div>

            {/* Status Icon */}
            <div className="col-span-1 -col-end-1 flex justify-end items-center gap-1">
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {isComplete ? (
                  <div
                    className={`w-4 h-4 rounded-full bg-green-500 flex items-center justify-center ${
                      isDark
                        ? "shadow-lg shadow-green-500/30"
                        : "shadow-md shadow-green-200"
                    }`}
                  >
                    <Check className="w-2 h-2 text-black" />
                  </div>
                ) : isEditable ? (
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      isDark
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-red-400 bg-red-50"
                    } flex items-center justify-center`}
                  >
                    <Circle
                      className={`w-2 h-2 ${isDark ? "text-orange-500" : "text-red-500"}`}
                    />
                  </div>
                ) : (
                  <X
                    className={`w-4 h-4 ${isDark ? "text-zinc-600" : "text-zinc-300"}`}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
