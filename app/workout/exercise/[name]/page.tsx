"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkoutStore } from "../../../stores/WorkoutStore";
import { useState } from "react";
import Link from "next/link";
import SetInput from "./SetInput";
import SettingsModal from "./SettingsModal";
import Controls from "./Controls";
import ExerciseHistory from "./History";
import Stopwatch from "./Stopwatch";

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.name as string;

  const { currentWorkout, removeExercise } = useWorkoutStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const exercise = currentWorkout?.exercises.find((e) => e.id === exerciseId);

  if (!exercise) {
    return <div className="p-4 text-white">Exercise not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/workout"
          className="text-white text-sm border border-white p-4 rounded-md"
        >
          ← Back
        </Link>
        <h2 className="text-white text-lg font-bold uppercase truncate max-w-45">
          {exercise.name}
        </h2>
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full border border-cyan-400 text-sm"
        >
          ⚙️
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        exerciseId={exercise.id}
      />

      {/* Sets */}
      <SetInput exerciseId={exercise.id} />

      {/* Controls */}
      <Controls exerciseId={exercise.id} />
      <ExerciseHistory exerciseName={exercise.name} />
      <Stopwatch />
    </div>
  );
}
