"use client";

import { useEffect, useState } from "react";
import { useWorkoutStore } from "../../stores/WorkoutStore";
import { useTheme } from "../../context/ThemeContext";
import { Exercise } from "../../db/models/Exercises";
import { Plus, Check, X } from "lucide-react";

const IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/refs/heads/main/exercises/";

export default function ExercisesList({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { addExercise, currentWorkout } = useWorkoutStore();

  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  const isExerciseAdded = (exercise: Exercise) => {
    return (
      currentWorkout?.exercises.some((e) => e._id === exercise._id) || false
    );
  };

  return (
    <>
      <div className="space-y-3">
        {exercises.map((exercise) => {
          const added = isExerciseAdded(exercise);
          return (
            <div
              key={exercise._id}
              className={`
                p-3 rounded-sm border transition-all
                ${
                  isDark
                    ? `bg-linear-to-br from-zinc-900 to-zinc-950 ${
                        added
                          ? "border-green-800/50 bg-linear-to-br from-green-950/20 to-zinc-900"
                          : "border-zinc-800/50 hover:border-orange-700/50"
                      }`
                    : `bg-white ${
                        added
                          ? "border-green-300 bg-green-50/50"
                          : "border-gray-200 hover:border-red-300"
                      }`
                }
              `}
            >
              <div className="flex items-center gap-3">
                <ExerciseThumbnail
                  images={exercise.images || []}
                  alt={exercise.name}
                  isDark={isDark}
                  onClick={() => setPreviewExercise(exercise)}
                />

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-black text-xs uppercase tracking-wider wrap-break-words ${
                      isDark ? "text-white" : "text-zinc-800"
                    }`}
                  >
                    {exercise.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] uppercase tracking-wider">
                    <span
                      className={isDark ? "text-zinc-400" : "text-zinc-500"}
                    >
                      {exercise.primaryMuscles.join(", ")}
                    </span>
                    <span
                      className={isDark ? "text-zinc-600" : "text-zinc-300"}
                    >
                      •
                    </span>
                    <span
                      className={isDark ? "text-zinc-400" : "text-zinc-500"}
                    >
                      {exercise.equipment}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => addExercise(exercise)}
                  disabled={added}
                  className={`
                    shrink-0 px-4 py-1.5 rounded-sm text-xs font-black uppercase tracking-wider transition
                    ${
                      added
                        ? isDark
                          ? "bg-green-600/30 text-green-400 border border-green-600/30 cursor-default"
                          : "bg-green-100 text-green-600 border border-green-300 cursor-default"
                        : isDark
                          ? "bg-orange-600 hover:bg-orange-700 text-white border border-orange-600/30 shadow-lg shadow-orange-600/20"
                          : "bg-red-600 hover:bg-red-700 text-white border border-red-400 shadow-sm"
                    }
                  `}
                >
                  {added ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> Added
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {previewExercise && (
        <ExercisePreview
          exercise={previewExercise}
          isDark={isDark}
          onClose={() => setPreviewExercise(null)}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Thumbnail — cross-fades between images every 1.5s
// ---------------------------------------------------------------------------

function ExerciseThumbnail({
  images,
  alt,
  isDark,
  onClick,
}: {
  images: string[];
  alt: string;
  isDark: boolean;
  onClick: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setPreviousIndex(index);
      setIndex((i) => (i + 1) % images.length);
      setLoaded(false);
    }, 1500);
    return () => clearInterval(id);
  }, [images.length, index]);

  if (images.length === 0) {
    return (
      <div
        className={`shrink-0 w-14 h-14 rounded-sm flex items-center justify-center ${
          isDark ? "bg-zinc-800" : "bg-gray-100"
        }`}
      >
        <span
          className={`text-[8px] font-black uppercase ${
            isDark ? "text-zinc-600" : "text-zinc-400"
          }`}
        >
          No img
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${alt} larger`}
      className={`relative shrink-0 w-14 h-14 rounded-sm overflow-hidden border transition ${
        isDark
          ? "border-zinc-800 bg-zinc-900 hover:border-orange-700/50"
          : "border-gray-200 bg-gray-50 hover:border-red-300"
      }`}
    >
      {/* Base layer — previous image, stays visible */}
      <img
        src={`${IMAGE_BASE}${images[previousIndex]}`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Top layer — fades in once loaded */}
      <img
        key={images[index]}
        src={`${IMAGE_BASE}${images[index]}`}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {images.length > 1 && (
        <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5 z-10">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-1 h-1 rounded-full transition ${
                i === index
                  ? isDark
                    ? "bg-orange-400"
                    : "bg-red-500"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Full-size preview modal — same cross-fade
// ---------------------------------------------------------------------------

function ExercisePreview({
  exercise,
  isDark,
  onClose,
}: {
  exercise: Exercise;
  isDark: boolean;
  onClose: () => void;
}) {
  const images = exercise.images || [];
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setPreviousIndex(index);
      setIndex((i) => (i + 1) % images.length);
      setLoaded(false);
    }, 1500);
    return () => clearInterval(id);
  }, [images.length, index]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed max-w-md mx-auto inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${exercise.name} preview`}
    >
      <button
        onClick={onClose}
        aria-label="Close preview"
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-sm flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[calc(100vw-2rem)] flex flex-col items-center gap-4"
      >
        {images.length > 0 ? (
          <div className="relative w-full aspect-square rounded-sm overflow-hidden border border-white/10 bg-black">
            {/* Base layer — previous image */}
            <img
              src={`${IMAGE_BASE}${images[previousIndex]}`}
              alt=""
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Top layer — fades in once loaded */}
            <img
              key={images[index]}
              src={`${IMAGE_BASE}${images[index]}`}
              alt={exercise.name}
              onLoad={() => setLoaded(true)}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        ) : (
          <div className="w-full aspect-square rounded-sm flex items-center justify-center bg-zinc-900 text-zinc-500">
            No image available
          </div>
        )}

        <div className="text-center px-2">
          <h3 className="text-white text-sm font-black uppercase tracking-wider wrap-break-words">
            {exercise.name}
          </h3>
          <p className="text-white/50 text-[10px] uppercase tracking-wider mt-1">
            {exercise.primaryMuscles.join(", ")} • {exercise.equipment}
          </p>
        </div>

        {images.length > 1 && (
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setPreviousIndex(index);
                  setIndex(i);
                  setLoaded(false);
                }}
                aria-label={`Image ${i + 1}`}
                className={`w-2 h-2 rounded-full transition ${
                  i === index ? "bg-orange-400" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
