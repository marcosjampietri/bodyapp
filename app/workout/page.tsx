"use client";

import { useRouter } from "next/navigation";
import { useWorkoutStore } from "../stores/WorkoutStore";
import Link from "next/link";
import { useState } from "react";

export default function WorkoutPage() {
  const router = useRouter();
  const { currentWorkout, completeWorkout, cancelWorkout } = useWorkoutStore();
  const [moveModalOpen, setMoveModalOpen] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const exercises = currentWorkout?.exercises || [];
  const hasExercises = exercises.length > 0;

  // Check if all exercises are complete
  const allComplete = exercises.every((ex) =>
    ex.sets.every((s) => Number(s.reps) > 0 && Number(Number(s.weight)) > 0),
  );

  const completedExercises = exercises.filter((ex) =>
    ex.sets.some((s) => Number(s.reps) > 0 && Number(Number(s.weight)) > 0),
  );

  const handleFinish = () => {
    if (allComplete) {
      completeWorkout();
      setShowModal(false);
    } else {
      setShowAlert(true);
    }
  };

  const handleForceFinish = () => {
    if (completedExercises.length > 0) {
      completeWorkout();
      setShowModal(false);
      setShowAlert(false);
    } else {
      alert("Nothing to save!");
    }
  };

  // Get completion status for each exercise
  const getExerciseStatus = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise) return { completed: false, hasData: false };

    const hasData = exercise.sets.some(
      (s) => Number(s.reps) > 0 && Number(Number(s.weight)) > 0,
    );
    const allComplete = exercise.sets.every(
      (s) => Number(s.reps) > 0 && Number(Number(s.weight)) > 0,
    );

    return { completed: allComplete, hasData };
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-md mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Link href="/" className="text-white/70 text-sm">
          ← Home
        </Link>
        <span className="text-white/50 text-xs">⚡ Workout</span>
        <button className="text-white/70 text-sm">👤</button>
      </div>

      {/* Save/Clear Controls */}
      {hasExercises && (
        <div className="flex justify-between mb-4 gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 bg-cyan-500 text-black font-bold py-2 rounded-md hover:bg-cyan-400 transition text-sm"
          >
            SAVE
          </button>
          <button
            onClick={() => {
              if (confirm("Clear all exercises?")) {
                cancelWorkout();
              }
            }}
            className="flex-1 bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition text-sm"
          >
            CLEAR
          </button>
        </div>
      )}

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {exercises.map((exercise) => {
          const { completed, hasData } = getExerciseStatus(exercise.id);
          const reps = exercise.sets.map((s) => s.reps);
          const minReps = Math.min(...reps);
          const maxReps = Math.max(...reps);

          return (
            <div key={exercise.id} className="flex items-center gap-2">
              {/* Icon to open move modal */}
              <button
                onClick={() => setMoveModalOpen(exercise.id)}
                className="w-10 h-10 flex items-center justify-center border border-gray-500 rounded bg-gray-800/50"
              >
                {completed ? (
                  <span className="text-green-400 text-lg">✓</span>
                ) : hasData ? (
                  <span className="text-yellow-400 text-lg">◉</span>
                ) : (
                  <span className="text-gray-500 text-lg">○</span>
                )}
              </button>

              {/* Exercise Row */}
              <Link
                href={`/workout/exercise/${exercise.id}`}
                className={`
                  flex-1 flex items-center justify-between p-3 rounded-md border border-gray-600
                  ${completed ? "bg-green-900/30 border-green-500" : "bg-gray-800/50"}
                  ${hasData && !completed ? "border-yellow-500/50" : ""}
                  hover:bg-gray-700/50 transition
                `}
              >
                <span className="text-white text-sm font-medium truncate flex-1">
                  {exercise.name}
                </span>
                <span className="text-white/70 text-sm mx-1">
                  {exercise.sets.length}
                </span>
                <span className="text-white/40 text-xs">×</span>
                <span className="text-white/70 text-sm w-16 text-right">
                  {minReps}
                  {maxReps !== minReps ? ` - ${maxReps}` : ""}
                </span>
                <span className="text-cyan-400 ml-2">›</span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Move Modal */}
      {moveModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-gray-700 rounded-lg p-2 min-w-50">
            <div className="flex flex-col">
              {(() => {
                const currentIndex = exercises.findIndex(
                  (e) => e.id === moveModalOpen,
                );
                return (
                  <>
                    <button
                      onClick={() => {
                        if (currentIndex > 0) {
                          const { updateExerciseOrder } =
                            useWorkoutStore.getState();
                          updateExerciseOrder(moveModalOpen, currentIndex - 1);
                        }
                        setMoveModalOpen(null);
                      }}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-600 rounded"
                    >
                      <span className="text-white text-sm">MOVE ABOVE</span>
                      <span className="text-white text-lg">↑</span>
                    </button>
                    <button
                      onClick={() => {
                        if (currentIndex < exercises.length - 1) {
                          const { updateExerciseOrder } =
                            useWorkoutStore.getState();
                          updateExerciseOrder(moveModalOpen, currentIndex + 1);
                        }
                        setMoveModalOpen(null);
                      }}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-600 rounded"
                    >
                      <span className="text-white text-sm">MOVE BELOW</span>
                      <span className="text-white text-lg">↓</span>
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-cyan-400 w-[90%] max-w-sm p-6 rounded-lg">
            {!showAlert ? (
              <div className="text-center">
                <button
                  onClick={handleFinish}
                  className="w-full bg-white text-black font-bold py-3 rounded-md mb-2"
                >
                  FINISH WORKOUT
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-black/20 text-white font-bold py-3 rounded-md"
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-black font-bold mb-4">
                  Your Workout contains incomplete exercises. Finish Workout
                  deleting empty data?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleForceFinish}
                    className="flex-1 bg-white text-black font-bold py-3 rounded-md"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setShowAlert(false);
                    }}
                    className="flex-1 bg-black/20 text-white font-bold py-3 rounded-md"
                  >
                    IGNORE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Buttons */}
      <div className="mt-4 space-y-2">
        {hasExercises ? (
          <button
            onClick={() => router.push("/build")}
            className="w-full bg-cyan-500 text-black font-bold py-3 rounded-md hover:bg-cyan-400 transition"
          >
            + Add Exercise
          </button>
        ) : (
          <>
            <button
              onClick={() => router.push("/build")}
              className="w-full bg-cyan-500 text-black font-bold py-3 rounded-md hover:bg-cyan-400 transition"
            >
              Build New Workout
            </button>
            <button
              onClick={() => router.push("/history")}
              className="w-full bg-gray-700 text-white font-bold py-3 rounded-md hover:bg-gray-600 transition"
            >
              Load from History
            </button>
          </>
        )}
      </div>
    </div>
  );
}
