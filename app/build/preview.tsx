"use client";
import Link from "next/link";
import { useWorkoutStore } from "../stores/WorkoutStore";

export default function WorkoutPreview() {
  const { currentWorkout, removeExercise } = useWorkoutStore();

  // console.log("exercise State", currentWorkout?.exercises);
  if (!currentWorkout) {
    return;
  }

  return (
    <div className="fixed bottom-0 w-md  bg-red-700">
      <Link href={"/workout"}>GO TO WORKOUT</Link>
      {currentWorkout?.exercises.map((x) => (
        <div key={x._id}>
          {x.name}
          <button onClick={() => removeExercise(x.id)}>__X__</button>
        </div>
      ))}
    </div>
  );
}
