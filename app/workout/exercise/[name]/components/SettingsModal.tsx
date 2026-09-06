"use client";

import { useState, useEffect } from "react";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";
import { useTheme } from "@/app/context/ThemeContext";
import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseId: string;
}

export default function SettingsModal({
  isOpen,
  onClose,
  exerciseId,
}: SettingsModalProps) {
  const { currentWorkout, updateExerciseSettings } = useWorkoutStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const exercise = currentWorkout?.exercises.find((e) => e.id === exerciseId);
  const settings = exercise?.settings || { splitWeight: false, barWeight: 0 };

  const [splitWeight, setSplitWeight] = useState(settings.splitWeight || false);
  const [barWeight, setBarWeight] = useState(settings.barWeight || 0);

  useEffect(() => {
    if (exercise) {
      setSplitWeight(exercise.settings?.splitWeight || false);
      setBarWeight(exercise.settings?.barWeight || 0);
    }
  }, [exercise]);

  const handleSave = () => {
    updateExerciseSettings(exerciseId, { splitWeight, barWeight });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className={`w-[90%] max-w-sm p-6 rounded-sm border ${
          isDark
            ? "bg-zinc-900 border-orange-800/30 shadow-lg shadow-orange-900/20"
            : "bg-white border-orange-200 shadow-lg"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-sm font-black uppercase tracking-wider ${isDark ? "text-white" : "text-zinc-800"}`}
          >
            Weight Settings
          </h3>
          <button
            onClick={onClose}
            className={`p-1 ${isDark ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-zinc-800"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split toggle */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-sm font-bold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
          >
            Split Weight
          </span>
          <button
            onClick={() => setSplitWeight(!splitWeight)}
            className={`w-12 h-6 rounded-full transition ${
              splitWeight
                ? isDark
                  ? "bg-orange-500"
                  : "bg-red-500"
                : isDark
                  ? "bg-zinc-700"
                  : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition ${
                splitWeight ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Bar toggle */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-sm font-bold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
          >
            Bar Weight
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBarWeight(barWeight === 0 ? 20 : 0)}
              className={`w-12 h-6 rounded-full transition ${
                barWeight > 0
                  ? isDark
                    ? "bg-orange-500"
                    : "bg-red-500"
                  : isDark
                    ? "bg-zinc-700"
                    : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition ${
                  barWeight > 0 ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
            {barWeight > 0 && (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={barWeight}
                  onChange={(e) => setBarWeight(Number(e.target.value) || 0)}
                  className={`w-12 px-1 py-1 text-center text-sm font-bold rounded-sm font-michroma ${
                    isDark
                      ? "bg-zinc-800 text-white border border-orange-500/30 focus:border-orange-500"
                      : "bg-white text-zinc-800 border border-red-300 focus:border-red-500"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                />
                <span
                  className={`text-xs font-bold ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  kg
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-sm text-sm font-black uppercase tracking-wider ${
            isDark
              ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/30"
              : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-300"
          }`}
        >
          Done
        </button>
      </div>
    </div>
  );
}
