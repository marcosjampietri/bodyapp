"use client";

import { useState } from "react";
import { useWorkoutStore } from "../../stores/WorkoutStore";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../../components/ui/Button";

export default function WorkoutControls() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { currentWorkout, completeWorkout, cancelWorkout } = useWorkoutStore();
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const exercises = currentWorkout?.exercises || [];
  const hasExercises = exercises.length > 0;

  const allComplete = exercises.every((ex) =>
    ex.sets.every((s) => Number(s.weight) > 0 && s.reps > 0),
  );

  const completedExercises = exercises.filter((ex) =>
    ex.sets.some((s) => Number(s.weight) > 0 && s.reps > 0),
  );

  if (!hasExercises) return null;

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

  return (
    <>
      <div className="flex gap-2 mb-6">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setShowModal(true)}
        >
          SAVE
        </Button>
        <Button
          variant="danger"
          size="lg"
          fullWidth
          onClick={() => {
            if (confirm("Clear all exercises?")) {
              cancelWorkout();
            }
          }}
        >
          CLEAR
        </Button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            className={`w-[90%] max-w-sm p-6 rounded-sm border ${
              isDark
                ? "bg-zinc-900 border-orange-800/30 shadow-lg shadow-orange-900/20"
                : "bg-white border-orange-200 shadow-lg"
            }`}
          >
            {!showAlert ? (
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleFinish}
                >
                  FINISH WORKOUT
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setShowModal(false)}
                >
                  CANCEL
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p
                  className={`text-center text-sm font-bold ${
                    isDark ? "text-white" : "text-zinc-800"
                  }`}
                >
                  Your Workout contains incomplete exercises. Finish Workout
                  deleting empty data?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleForceFinish}
                  >
                    OK
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      setShowModal(false);
                      setShowAlert(false);
                    }}
                  >
                    IGNORE
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
