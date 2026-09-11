"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkoutStore } from "../../stores/WorkoutStore";
import { useTheme } from "../../context/ThemeContext";
import { ThemeToggle } from "../../components/theme/ThemeToggle";
import { Button } from "../../components/ui/Button";
import dayjs from "dayjs";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { workoutHistory, loadFromDatabase } = useWorkoutStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    loadFromDatabase();
  }, []);

  const historyItem = workoutHistory.find(
    (hI) => hI.id === selectedWorkoutId || hI._id === selectedWorkoutId,
  );

  const sortedHistory = [...workoutHistory].sort((a, b) =>
    dayjs(b.date).isBefore(dayjs(a.date)) ? -1 : 1,
  );

  const markedDates = sortedHistory.reduce(
    (acc: Record<string, boolean>, hi) => {
      const dateString = dayjs(hi.date).format("YYYY-MM-DD");
      acc[dateString] = true;
      return acc;
    },
    {},
  );

  const toggleExpand = (exerciseId: string) => {
    setExpandedItems((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId],
    );
  };

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

  useEffect(() => {
    if (sortedHistory.length > 0 && !selectedWorkoutId) {
      const firstWorkoutId = sortedHistory[0].id || sortedHistory[0]._id;
      if (firstWorkoutId) {
        setSelectedWorkoutId(firstWorkoutId);
      }
    }
  }, [sortedHistory, selectedWorkoutId]);

  // ---------- Empty state ----------
  if (workoutHistory.length === 0) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="max-w-md mx-auto w-full px-4 py-6">
          <div
            className={`flex items-center gap-3 mb-8 border-b pb-4 ${isDark ? "border-orange-900/20" : "border-orange-200"}`}
          >
            <Link
              href="/"
              className={`shrink-0 flex items-center gap-2 text-sm font-medium transition ${
                isDark
                  ? "text-zinc-400 hover:text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1
              className={`flex-1 text-center text-xl font-black tracking-tight ${isDark ? "text-white" : "text-zinc-800"}`}
            >
              History
            </h1>
            <ThemeToggle />
          </div>
          <div
            className={`text-center py-12 text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
          >
            No workout history yet
          </div>
        </div>
      </div>
    );
  }

  const displayItem = historyItem || sortedHistory[0];

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-md mx-auto w-full px-4 py-6">
        {/* Header */}
        <div
          className={`flex items-center gap-3 mb-8 border-b pb-4 ${
            isDark ? "border-orange-900/20" : "border-orange-200"
          }`}
        >
          <Link
            href="/"
            className={`shrink-0 flex items-center gap-2 text-sm font-medium transition ${
              isDark
                ? "text-zinc-400 hover:text-white"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <h1
            className={`flex-1 text-center text-xl font-black tracking-tight ${
              isDark
                ? "bg-linear-to-r from-red-500 to-orange-400 bg-clip-text text-transparent"
                : "text-red-600"
            }`}
          >
            HISTORY
          </h1>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              aria-label={showCalendar ? "Hide calendar" : "Show calendar"}
              onClick={() => setShowCalendar(!showCalendar)}
              className={`w-9 h-9 rounded-sm flex items-center justify-center transition ${
                isDark
                  ? "bg-zinc-900 border border-orange-900/30 hover:border-orange-700/50"
                  : "bg-white border border-orange-200 hover:border-orange-300"
              }`}
            >
              <CalendarIcon
                className={`w-4 h-4 ${isDark ? "text-orange-400" : "text-red-600"}`}
              />
            </button>
          </div>
        </div>

        {/* Calendar Modal */}
        {showCalendar && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-sm p-4 w-full max-w-sm border ${
                isDark
                  ? "bg-zinc-900 border-orange-800/30 shadow-2xl shadow-orange-900/20"
                  : "bg-white border-red-200 shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-black uppercase tracking-widest ${
                    isDark ? "text-orange-400" : "text-red-600"
                  }`}
                >
                  Jump to date
                </span>
                <button
                  aria-label="Close calendar"
                  onClick={() => setShowCalendar(false)}
                  className={`p-1 rounded-sm transition ${
                    isDark
                      ? "text-zinc-500 hover:text-white"
                      : "text-zinc-400 hover:text-zinc-800"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Calendar
                onChange={(value: any) => {
                  const date = value instanceof Date ? value : value;
                  if (date) {
                    const dateStr = dayjs(date).format("YYYY-MM-DD");
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
                        <div
                          className={`w-1.5 h-1.5 rounded-full mx-auto mt-0.5 ${
                            isDark ? "bg-orange-500" : "bg-red-500"
                          }`}
                        />
                      );
                    }
                  }
                  return null;
                }}
                className="border-0"
              />
            </div>
          </div>
        )}

        {/* Workout List */}
        <div className="flex justify-between items-center mb-3">
          <span
            className={`text-xs font-black uppercase tracking-widest ${
              isDark ? "text-orange-400" : "text-red-600"
            }`}
          >
            Workouts ({sortedHistory.length})
          </span>
        </div>

        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
          {sortedHistory.map((hi, i) => {
            const workoutId = hi.id || hi._id;
            const isSelected =
              workoutId ===
              (selectedWorkoutId || displayItem?.id || displayItem?._id);
            const totalSets = hi.exercises.reduce(
              (acc, ex) => acc + ex.sets.length,
              0,
            );

            return (
              <button
                key={i}
                onClick={() => {
                  if (workoutId) setSelectedWorkoutId(workoutId);
                }}
                className={`
                  w-full flex items-center justify-between p-3 rounded-sm border transition-all text-left
                  ${
                    isSelected
                      ? isDark
                        ? "bg-linear-to-br from-orange-950/40 to-zinc-900 border-orange-500/60 shadow-lg shadow-orange-600/20"
                        : "bg-red-50 border-red-400 shadow-md shadow-red-200/50"
                      : isDark
                        ? "bg-zinc-900 border-zinc-800/50 hover:border-orange-700/50"
                        : "bg-white border-gray-200 hover:border-red-300"
                  }
                `}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-black uppercase tracking-wider ${
                      isSelected
                        ? isDark
                          ? "text-orange-400"
                          : "text-red-600"
                        : isDark
                          ? "text-white"
                          : "text-zinc-800"
                    }`}
                  >
                    {dayjs(hi.date).format("DD/MM/YY HH:mm")}
                  </div>
                  <div
                    className={`text-[10px] uppercase tracking-wider mt-0.5 ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    {hi.exercises[0]?.name || "No exercises"}
                    {hi.exercises.length > 1 &&
                      ` +${hi.exercises.length - 1} more`}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    {hi.exercises.length} ex · {totalSets} sets
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Workout Details */}
        {displayItem && (
          <>
            {/* Redo Button */}
            <div className="mb-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleRedoWorkout}
              >
                <span className="flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Redo Workout
                </span>
              </Button>
            </div>

            {/* Exercises header */}
            <div className="flex justify-between items-center mb-3">
              <span
                className={`text-xs font-black uppercase tracking-widest ${
                  isDark ? "text-orange-400" : "text-red-600"
                }`}
              >
                Exercises ({displayItem.exercises.length})
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {dayjs(displayItem.date).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>

            {/* Exercise List */}
            <div className="space-y-2">
              {displayItem.exercises.map((exercise) => {
                const isExpanded = expandedItems.includes(exercise.id);
                const reps = exercise.sets.map((s) => s.reps);
                const minReps = Math.min(...reps);
                const maxReps = Math.max(...reps);

                return (
                  <div
                    key={exercise.id}
                    className={`
                      rounded-sm border transition-all
                      ${
                        isDark
                          ? "bg-linear-to-br from-zinc-900 to-zinc-950 border-zinc-800/50"
                          : "bg-white border-gray-200"
                      }
                    `}
                  >
                    <button
                      onClick={() => toggleExpand(exercise.id)}
                      className="w-full flex items-center justify-between p-3 transition"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-1.5 h-8 rounded-sm shrink-0 ${
                            isDark
                              ? "bg-linear-to-b from-red-600 to-orange-500"
                              : "bg-red-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-black text-sm uppercase tracking-wider truncate ${
                              isDark ? "text-white" : "text-zinc-800"
                            }`}
                          >
                            {exercise.name}
                          </div>
                          <div
                            className={`text-[10px] uppercase tracking-wider mt-0.5 ${
                              isDark ? "text-zinc-500" : "text-zinc-400"
                            }`}
                          >
                            {exercise.sets.length} sets · {minReps}
                            {maxReps !== minReps ? ` - ${maxReps}` : ""} reps
                          </div>
                        </div>
                      </div>

                      {isExpanded ? (
                        <ChevronUp
                          className={`w-4 h-4 shrink-0 ${
                            isDark ? "text-orange-400" : "text-red-500"
                          }`}
                        />
                      ) : (
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 ${
                            isDark ? "text-orange-400" : "text-red-500"
                          }`}
                        />
                      )}
                    </button>

                    {isExpanded && (
                      <div
                        className={`p-3 pt-0 border-t space-y-1 ${
                          isDark ? "border-zinc-800/50" : "border-gray-200"
                        }`}
                      >
                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className={`flex items-center justify-between text-sm py-1 border-b last:border-b-0 ${
                              isDark ? "border-zinc-800/30" : "border-gray-100"
                            }`}
                          >
                            <span
                              className={`text-xs font-black w-6 ${
                                isDark ? "text-zinc-500" : "text-zinc-400"
                              }`}
                            >
                              {setIndex + 1}
                            </span>
                            <div className="flex items-center gap-2 flex-1 ml-2">
                              <span
                                className={`font-michroma font-bold ${
                                  isDark ? "text-white" : "text-zinc-800"
                                }`}
                              >
                                {set.reps}
                              </span>
                              <span
                                className={
                                  isDark ? "text-zinc-500" : "text-zinc-400"
                                }
                              >
                                ×
                              </span>
                              <span
                                className={`font-michroma font-bold ${
                                  isDark ? "text-white" : "text-zinc-800"
                                }`}
                              >
                                {set.weight}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${
                                  isDark ? "text-zinc-500" : "text-zinc-400"
                                }`}
                              >
                                KG
                              </span>
                            </div>
                            {set.rpe && (
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${
                                  isDark ? "text-orange-400" : "text-red-500"
                                }`}
                              >
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

        {/* Bottom accent */}
        <div className="mt-8 text-center">
          <p
            className={`text-[8px] uppercase tracking-[0.3em] font-black ${
              isDark ? "text-orange-900/30" : "text-red-200"
            }`}
          >
            Steel forged in blood
          </p>
        </div>
      </div>
    </div>
  );
}
