"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkoutStore } from "../stores/WorkoutStore";
import dayjs from "dayjs";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function HistoryPage() {
  const router = useRouter();
  const { workoutHistory, loadFromDatabase } = useWorkoutStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    loadFromDatabase();
  }, []);

  // Get selected history item by ID
  const historyItem = workoutHistory.find(
    (hI) => hI.id === selectedWorkoutId || hI._id === selectedWorkoutId,
  );

  // Sort history by date (newest first)
  const sortedHistory = [...workoutHistory].sort((a, b) =>
    dayjs(b.date).isBefore(dayjs(a.date)) ? -1 : 1,
  );

  // Get dates that have workouts for calendar marking
  const markedDates = sortedHistory.reduce(
    (acc: Record<string, boolean>, hi) => {
      const dateString = dayjs(hi.date).format("YYYY-MM-DD");
      acc[dateString] = true;
      return acc;
    },
    {},
  );

  // Toggle expand/collapse for exercise
  const toggleExpand = (exerciseId: string) => {
    setExpandedItems((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId],
    );
  };

  // Handle redo workout
  const handleRedoWorkout = () => {
    if (!historyItem) return;
    const { addExercise, createWorkout } = useWorkoutStore.getState();
    const currentWorkout = useWorkoutStore.getState().currentWorkout;

    if (!currentWorkout) {
      createWorkout("Redo Workout");
    }

    historyItem.exercises.forEach((ex) => {
      addExercise(ex);
    });

    router.push("/workout");
  };

  // Auto-select first workout if none selected
  useEffect(() => {
    if (sortedHistory.length > 0 && !selectedWorkoutId) {
      const firstWorkoutId = sortedHistory[0].id || sortedHistory[0]._id;
      if (firstWorkoutId) {
        setSelectedWorkoutId(firstWorkoutId);
      }
    }
  }, [sortedHistory, selectedWorkoutId]);

  if (workoutHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 max-w-md mx-auto flex items-center justify-center">
        <p className="text-gray-400">No workout history yet</p>
      </div>
    );
  }

  // Force show first workout if selected ID doesn't match anything
  const displayItem = historyItem || sortedHistory[0];

  return (
    <div className="min-h-screen bg-gray-900 p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Link href="/" className="text-white/70 text-sm">
          ← Back
        </Link>
        <h1 className="text-white text-xl font-bold">History</h1>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full border border-cyan-400 text-lg"
        >
          📅
        </button>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[90%] max-w-sm">
            <Calendar
              onChange={(value: any) => {
                const date = value instanceof Date ? value : value;
                if (date) {
                  const dateStr = dayjs(date).format("YYYY-MM-DD");
                  // Find first workout on this date
                  const workoutOnDate = sortedHistory.find(
                    (h) => dayjs(h.date).format("YYYY-MM-DD") === dateStr,
                  );
                  if (workoutOnDate) {
                    const workoutId = workoutOnDate.id || workoutOnDate._id;
                    if (workoutId) {
                      setSelectedWorkoutId(workoutId);
                    }
                  }
                  setShowCalendar(false);
                }
              }}
              tileContent={({ date, view }: any) => {
                if (view === "month") {
                  const dateStr = dayjs(date).format("YYYY-MM-DD");
                  if (markedDates[dateStr]) {
                    return (
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mx-auto mt-1" />
                    );
                  }
                }
                return null;
              }}
              className="border-0"
            />
            <button
              onClick={() => setShowCalendar(false)}
              className="w-full mt-4 bg-gray-200 text-black py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Date List */}
      <div className="bg-gray-800 rounded-lg border border-gray-600 max-h-48 overflow-y-auto mb-4">
        <div className="p-2 text-xs text-gray-400 border-b border-gray-600">
          Workout History
        </div>
        {sortedHistory.map((hi, i) => {
          const workoutId = hi.id || hi._id;
          const isSelected =
            workoutId ===
            (selectedWorkoutId || displayItem?.id || displayItem?._id);
          return (
            <button
              key={i}
              onClick={() => {
                if (workoutId) setSelectedWorkoutId(workoutId);
              }}
              className={`w-full flex items-center p-3 border-b border-gray-600 last:border-b-0 ${
                isSelected ? "bg-cyan-500" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <span
                className={`text-sm w-24 ${isSelected ? "text-black font-bold" : "text-white"}`}
              >
                {dayjs(hi.date).format("DD/MM/YY HH:mm")}
              </span>
              <span
                className={`text-sm truncate flex-1 text-left ${
                  isSelected ? "text-black/70" : "text-white/70"
                }`}
              >
                {hi.exercises[0]?.name || "No exercises"}
              </span>
              <span
                className={`text-xs ${isSelected ? "text-black/50" : "text-gray-500"}`}
              >
                {hi.exercises.length} ex
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Workout Details */}
      {displayItem && (
        <>
          <div className="text-xs text-gray-400 mb-2">
            {dayjs(displayItem.date).format("DD/MM/YYYY HH:mm")}
            {displayItem.name && ` • ${displayItem.name}`}
          </div>

          {/* Redo Button */}
          <button
            onClick={handleRedoWorkout}
            className="w-full bg-cyan-500 text-black font-bold py-3 rounded-md hover:bg-cyan-400 transition mb-3"
          >
            Redo Workout
          </button>

          {/* Exercise List */}
          <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
            <div className="p-2 text-xs text-gray-400 border-b border-gray-600">
              Exercises ({displayItem.exercises.length})
            </div>
            {displayItem.exercises.map((exercise) => {
              const isExpanded = expandedItems.includes(exercise.id);
              const reps = exercise.sets.map((s) => s.reps);
              const minReps = Math.min(...reps);
              const maxReps = Math.max(...reps);

              return (
                <div
                  key={exercise.id}
                  className="border-b border-gray-600 last:border-b-0"
                >
                  {/* Exercise Header - Click to expand */}
                  <button
                    onClick={() => toggleExpand(exercise.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-700 transition"
                  >
                    <span className="text-white text-sm font-medium flex-1 text-left">
                      {exercise.name}
                    </span>
                    <span className="text-gray-400 text-xs mx-1">
                      {exercise.sets.length} sets
                    </span>
                    <span className="text-gray-400 text-xs mx-2 w-12 text-right">
                      {minReps}
                      {maxReps !== minReps ? ` - ${maxReps}` : ""}
                    </span>
                    <span className="text-gray-400 text-xs ml-2">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Expanded Sets */}
                  {isExpanded && (
                    <div className="p-3 pt-0 space-y-1 border-t border-gray-600">
                      {exercise.sets.map((set, setIndex) => (
                        <div
                          key={setIndex}
                          className="flex items-center justify-between text-sm py-1 border-b border-gray-700 last:border-b-0"
                        >
                          <span className="text-gray-400 w-6">
                            {setIndex + 1}
                          </span>
                          <div className="flex items-center gap-2 flex-1 ml-2">
                            <span className="text-white">{set.reps}</span>
                            <span className="text-gray-400">×</span>
                            <span className="text-white">{set.weight}</span>
                            <span className="text-gray-400">KG</span>
                          </div>
                          {set.rpe && (
                            <span className="text-gray-400 text-xs">
                              RPE {set.rpe}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
