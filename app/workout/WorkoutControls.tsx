"use client";

import { useState } from "react";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";

export default function WorkoutControls() {
  const { currentWorkout, completeWorkout, cancelWorkout } = useWorkoutStore();
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const exercises = currentWorkout?.exercises || [];
  const hasExercises = exercises.length > 0;

  // Check if all exercises are complete
  const allComplete = exercises.every((ex) =>
    ex.sets.every((s) => Number(s.reps) > 0 && Number(Number(s.weight)) > 0),
  );

  // Get completed exercises (with data)
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
      // Save only completed exercises
      const workout = {
        ...currentWorkout!,
        exercises: completedExercises,
        completed: true,
      };
      completeWorkout(); // This will save to history
      setShowModal(false);
      setShowAlert(false);
    } else {
      alert("Nothing to save!");
    }
  };

  if (!hasExercises) return null;

  return (
    <>
      {/* Buttons */}
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
    </>
  );
}
