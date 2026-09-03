"use client";

import { useState, useEffect } from "react";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";

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
  const exercise = currentWorkout?.exercises.find((e) => e.id === exerciseId);

  const [splitWeight, setSplitWeight] = useState(
    exercise?.settings?.splitWeight || false,
  );
  const [barWeight, setBarWeight] = useState(
    exercise?.settings?.barWeight || 0,
  );
  const [useBar, setUseBar] = useState(
    (exercise?.settings?.barWeight ?? 0) > 0,
  );

  // Update local state when exercise changes
  useEffect(() => {
    if (exercise?.settings) {
      setSplitWeight(exercise.settings.splitWeight || false);
      setBarWeight(exercise.settings.barWeight || 0);
      setUseBar((exercise.settings.barWeight ?? 0) > 0);
    }
  }, [exercise]);

  const saveSettings = () => {
    updateExerciseSettings(exerciseId, {
      splitWeight,
      barWeight: useBar ? barWeight : 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed w-md m-1 mx-auto inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-[96%] p-4 rounded border border-cyan-400">
        {/* Split */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-lg font-bold ${splitWeight ? "text-cyan-300" : "text-gray-500"}`}
          >
            SPLIT
          </span>
          <button
            onClick={() => setSplitWeight(!splitWeight)}
            className={`w-12 h-6 rounded-full transition ${splitWeight ? "bg-cyan-400" : "bg-gray-600"}`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition ${splitWeight ? "translate-x-6" : ""}`}
            />
          </button>
        </div>

        {/* Add Bar */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-lg font-bold ${useBar ? "text-cyan-300" : "text-gray-500"}`}
          >
            ADD BAR
          </span>
          <button
            onClick={() => {
              setUseBar(!useBar);
              if (!useBar) setBarWeight(20); // Default bar weight
            }}
            className={`w-12 h-6 rounded-full transition ${useBar ? "bg-cyan-400" : "bg-gray-600"}`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition ${useBar ? "translate-x-6" : ""}`}
            />
          </button>
        </div>

        {/* Bar Weight Input */}
        {useBar && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-cyan-300 font-bold">BAR WEIGHT:</span>
            <input
              type="text"
              data-testid="bar-weight-input"
              value={barWeight}
              onChange={(e) => {
                if (!/^\d*$/.test(e.target.value)) return;
                setBarWeight(parseInt(e.target.value) || 0);
              }}
              className="w-20 h-10 bg-gray-700 text-white text-center rounded border border-cyan-400"
              placeholder="0"
            />
          </div>
        )}

        {/* Done Button */}
        <button
          onClick={saveSettings}
          className="w-full bg-cyan-400 text-black py-2 rounded font-bold mt-2"
        >
          DONE
        </button>
      </div>
    </div>
  );
}
