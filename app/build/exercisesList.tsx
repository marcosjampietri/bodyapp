"use client";

import { useWorkoutStore } from "../stores/WorkoutStore";
import { Exercise } from "../db/models/Exercises";

// This is the main page component (Server Component)
export default function ExercisesList({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const { addExercise } = useWorkoutStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <div
          key={exercise._id}
          // href={`/exercises/${exercise.id}`}
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">{exercise.name}</h2>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Level:</span>
                <span className="capitalize">{exercise.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Force:</span>
                <span className="capitalize">{exercise.force}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Mechanic:</span>
                <span className="capitalize">{exercise.mechanic}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Equipment:</span>
                <span>{exercise.equipment}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Muscles:</span>
                <span>{exercise.primaryMuscles.join(", ")}</span>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              addExercise(exercise);
              console.log("click", exercise);
            }}
          >
            ADD TO WORKOUT
          </div>
        </div>
      ))}
    </div>
  );
}
