"use client";

import { useWorkoutStore } from "@/app/stores/WorkoutStore";

interface SetsProps {
  exerciseId: string;
}

export default function Sets({ exerciseId }: SetsProps) {
  const { currentWorkout, updateSet } = useWorkoutStore();

  const exercise = currentWorkout?.exercises.find((e) => e.id === exerciseId);
  if (!exercise) return null;

  const settings = {
    splitWeight: exercise.settings?.splitWeight || false,
    barWeight: exercise.settings?.barWeight || 0,
  };

  return (
    <div className="max-h-[40vh] w-full overflow-y-scroll">
      {exercise.sets.map((set, setIndex) => {
        const prog = exercise.sets[setIndex];

        // Check previous sets
        const previousSets = exercise.sets.slice(0, setIndex);
        const previousComplete = previousSets.every(
          (s) => Number(Number(s.weight)) > 0 && s.reps > 0,
        );

        const editable = setIndex === 0 || previousComplete;
        const isComplete = Number(prog?.weight) > 0 && prog?.reps > 0;

        const valueReps = prog?.reps?.toString() || "";
        const valueWeight = prog?.weight?.toString() || "";

        const bW = settings.barWeight || 0;
        const totalWeight =
          Number(valueWeight) * (settings.splitWeight ? 2 : 1) + bW;

        return (
          <div
            key={setIndex}
            className={`
              w-full mx-auto my-2 p-3 rounded flex items-center justify-between
              ${editable && !isComplete ? "border-2 border-cyan-400 bg-gray-800" : "bg-gray-800"}
              ${isComplete ? "bg-green-600" : ""}
              ${!editable ? "opacity-30" : ""}
            `}
            style={{
              height: settings.barWeight && settings.splitWeight ? 90 : 60,
            }}
          >
            {/* Set Number */}
            <span
              className={`w-5 text-white font-bold ${isComplete ? "text-black" : ""}`}
            >
              {setIndex + 1}
            </span>

            {/* Reps */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={valueReps}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!/^\d*$/.test(val)) return;
                  updateSet(exercise.id, set.id, {
                    weight: prog?.weight || 0,
                    reps: parseInt(val) || 0,
                    rpe: prog?.rpe,
                  });
                }}
                onBlur={() => {
                  updateSet(exercise.id, set.id, {
                    weight: prog?.weight || 0,
                    reps: parseInt(valueReps) || 0,
                    rpe: prog?.rpe,
                  });
                }}
                placeholder={set.reps?.toString() || ""}
                disabled={!editable}
                className={`
                  w-20 h-10 px-2 rounded text-center font-bold uppercase z-10
                  ${isComplete ? "bg-green-500 text-black border border-black" : "bg-gray-700 text-white border border-gray-500"}
                  ${!editable ? "opacity-50 cursor-not-allowed" : ""}
                `}
              />
              <span
                className={`font-bold ${isComplete ? "text-black" : "text-white"}`}
              >
                X
              </span>
            </div>

            {/* Weight */}
            {/* Weight */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={valueWeight}
                onChange={(e) => {
                  const input = e.target.value;

                  // Allow empty string, numbers, and a single dot
                  if (input === "") {
                    updateSet(exercise.id, set.id, {
                      weight: 0,
                      reps: prog?.reps || 0,
                      rpe: prog?.rpe,
                    });
                    return;
                  }

                  // Only allow numbers and dot
                  if (!/^[\d.]*$/.test(input)) return;

                  // Prevent multiple dots
                  if ((input.match(/\./g) || []).length > 1) return;

                  // Prevent more than 2 decimal places
                  const decimalIndex = input.indexOf(".");
                  if (decimalIndex !== -1 && input.length - decimalIndex > 3)
                    return;

                  const dot = input.endsWith(".");

                  // Store as string, not number - this preserves the dot
                  updateSet(exercise.id, set.id, {
                    weight: dot ? input : parseFloat(input) || 0,
                    reps: prog?.reps || 0,
                    rpe: prog?.rpe,
                  });
                }}
                onBlur={() => {
                  // Convert to number on blur
                  updateSet(exercise.id, set.id, {
                    weight: parseFloat(valueWeight) || 0,
                    reps: prog?.reps || 0,
                    rpe: prog?.rpe,
                  });
                }}
                placeholder={set.weight?.toString() || ""}
                disabled={!editable}
                className={`
      w-20 h-10 px-2 rounded text-center font-bold uppercase z-10
      ${isComplete ? "bg-green-500 text-black border border-black" : "bg-gray-700 text-white border border-gray-500"}
      ${!editable ? "opacity-50 cursor-not-allowed" : ""}
    `}
              />

              {/* Total Weight Display */}
              <div className="flex items-center gap-1 text-sm">
                {settings.splitWeight && valueWeight && (
                  <span
                    className={`px-1 ${isComplete ? "text-black" : "text-gray-300"}`}
                  >
                    + {valueWeight}
                  </span>
                )}
                {settings.barWeight > 0 && (
                  <span
                    className={`px-1 ${isComplete ? "text-black" : "text-gray-300"}`}
                  >
                    + {settings.barWeight}
                  </span>
                )}
                {(settings.barWeight > 0 || settings.splitWeight) &&
                  valueWeight && (
                    <span
                      className={`px-1 font-bold ${isComplete ? "text-black" : "text-cyan-400"}`}
                    >
                      = {totalWeight}
                    </span>
                  )}
                <span
                  className={`font-bold ${isComplete ? "text-black" : "text-white"}`}
                >
                  KG
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
