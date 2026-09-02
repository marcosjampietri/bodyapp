import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Exercise } from "../db/models/Exercises";

export interface WorkoutExercise extends Exercise {
  sets: WorkoutSet[];
  notes?: string;
  completed: boolean;
  order: number;
  settings?: {
    splitWeight?: boolean;
    barWeight?: number;
  };
}

export interface WorkoutSet {
  id: string;
  weight: number | string;
  reps: number;
  completed: boolean;
  rpe?: number; // Rate of Perceived Exertion
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  duration?: number; // in minutes
  notes?: string;
  completed: boolean;
  synced: boolean;
  userId?: string;
}

interface WorkoutState {
  // Current workout
  currentWorkout: Workout | null;

  // Workout history
  workoutHistory: Workout[];

  // Loading states
  isLoading: boolean;
  isSyncing: boolean;

  // Actions
  createWorkout: (name: string) => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;
  updateExerciseOrder: (exerciseId: string, newOrder: number) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  updateSet: (
    exerciseId: string,
    setId: string,
    data: Partial<WorkoutSet>,
  ) => void;
  deleteAllExercises: () => void;
  completeExercise: (exerciseId: string) => void;
  completeWorkout: () => void;
  cancelWorkout: () => void;
  updateWorkoutNotes: (notes: string) => void;
  updateExerciseNotes: (exerciseId: string, notes: string) => void;
  clearCurrentWorkout: () => void;
  updateExerciseSettings: (
    exerciseId: string,
    settings: { splitWeight?: boolean; barWeight?: number },
  ) => void;

  // Sync actions
  syncWorkouts: () => Promise<void>;
  saveToDatabase: (workout: Workout) => Promise<void>;
  loadFromDatabase: () => Promise<void>;
}

// Helper to generate unique IDs
const generateId = () => crypto.randomUUID();

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentWorkout: null,
      workoutHistory: [],
      isLoading: false,
      isSyncing: false,

      updateExerciseSettings: (
        exerciseId: string,
        settings: { splitWeight?: boolean; barWeight?: number },
      ) => {
        set((state) => {
          if (!state.currentWorkout) return state;

          const exercises = state.currentWorkout.exercises.map((e) => {
            if (e.id === exerciseId) {
              return {
                ...e,
                settings: {
                  ...e.settings,
                  ...settings,
                },
              };
            }
            return e;
          });

          return {
            currentWorkout: {
              ...state.currentWorkout,
              exercises,
            },
          };
        });
      },

      // Create a new workout
      createWorkout: (name: string) => {
        const workout: Workout = {
          id: generateId(),
          name: name || `Workout ${new Date().toLocaleDateString()}`,
          date: new Date(),
          exercises: [],
          completed: false,
          synced: false,
        };
        set({ currentWorkout: workout });
      },

      // Add an exercise to the current workout
      addExercise: (exercise: Exercise) => {
        const { currentWorkout, createWorkout } = get();

        // Create workout if none exists
        let workout = currentWorkout;
        if (!workout) {
          createWorkout("My Workout");
          workout = get().currentWorkout;
          if (!workout) return; // Safety check
        }

        const newExercise: WorkoutExercise = {
          ...exercise,
          sets: [
            {
              id: generateId(),
              weight: 0,
              reps: 0,
              completed: false,
            },
          ],
          completed: false,
          order: workout.exercises.length,
          notes: "",
        };

        set({
          currentWorkout: {
            ...workout,
            exercises: [...workout.exercises, newExercise],
          },
        });

        // console.log("exerciseAdded", exercise, "workout", workout);
      },
      // Remove an exercise
      removeExercise: (exerciseId: string) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.filter(
              (e) => e.id !== exerciseId,
            ),
          },
        });
      },

      deleteAllExercises: () => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: [],
          },
        });
      },

      // Add this implementation
      updateExerciseOrder: (exerciseId: string, newOrder: number) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const exercises = [...currentWorkout.exercises];
        const index = exercises.findIndex((e) => e.id === exerciseId);
        if (index === -1) return;

        const [moved] = exercises.splice(index, 1);
        exercises.splice(newOrder, 0, moved);

        exercises.forEach((e, idx) => (e.order = idx));

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises,
          },
        });
      },

      // Add a set to an exercise
      addSet: (exerciseId: string) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const exercises = currentWorkout.exercises.map((e) => {
          if (e.id === exerciseId) {
            return {
              ...e,
              sets: [
                ...e.sets,
                {
                  id: generateId(),
                  weight: 0,
                  reps: 0,
                  completed: false,
                },
              ],
            };
          }
          return e;
        });

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises,
          },
        });
      },

      // Remove a set
      removeSet: (exerciseId: string, setId: string) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const exercises = currentWorkout.exercises.map((e) => {
          if (e.id === exerciseId) {
            return {
              ...e,
              sets: e.sets.filter((s) => s.id !== setId),
            };
          }
          return e;
        });

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises,
          },
        });
      },

      // Update a set
      updateSet: (
        exerciseId: string,
        setId: string,
        data: Partial<WorkoutSet>,
      ) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const exercises = currentWorkout.exercises.map((e) => {
          if (e.id === exerciseId) {
            return {
              ...e,
              sets: e.sets.map((s) => {
                if (s.id === setId) {
                  return { ...s, ...data };
                }
                return s;
              }),
            };
          }
          return e;
        });

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises,
          },
        });
      },

      // Complete an exercise
      completeExercise: (exerciseId: string) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const exercises = currentWorkout.exercises.map((e) => {
          if (e.id === exerciseId) {
            return { ...e, completed: !e.completed };
          }
          return e;
        });

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises,
          },
        });
      },

      // Complete the entire workout
      completeWorkout: () => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const completedWorkout = {
          ...currentWorkout,
          completed: true,
          synced: false,
        };

        // Save to history
        set((state) => ({
          currentWorkout: null,
          workoutHistory: [completedWorkout, ...state.workoutHistory],
        }));

        // Auto-sync to database
        get().saveToDatabase(completedWorkout);
      },

      // Cancel the current workout
      cancelWorkout: () => {
        set({ currentWorkout: null });
      },

      // Update workout notes
      updateWorkoutNotes: (notes: string) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        set({
          currentWorkout: {
            ...currentWorkout,
            notes,
          },
        });
      },

      // Update exercise notes
      updateExerciseNotes: (exerciseId: string, notes: string) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const exercises = currentWorkout.exercises.map((e) => {
          if (e.id === exerciseId) {
            return { ...e, notes };
          }
          return e;
        });

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises,
          },
        });
      },

      // Clear current workout
      clearCurrentWorkout: () => {
        set({ currentWorkout: null });
      },

      // Save workout to database
      saveToDatabase: async (workout: Workout) => {
        try {
          const response = await fetch("/api/workouts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(workout),
          });

          if (response.ok) {
            // Update sync status
            set((state) => ({
              workoutHistory: state.workoutHistory.map((w) =>
                w.id === workout.id ? { ...w, synced: true } : w,
              ),
            }));
          }
        } catch (error) {
          console.error("Failed to save workout:", error);
          // Workout will stay in history with synced: false
          // It will be retried on next sync
        }
      },

      // Load workouts from database
      loadFromDatabase: async () => {
        set({ isLoading: true });

        try {
          const response = await fetch("/api/workouts");
          if (response.ok) {
            const data = await response.json();

            // Merge with local history (avoid duplicates)
            set((state) => {
              const existingIds = new Set(
                state.workoutHistory.map((w) => w.id),
              );
              const newWorkouts = data.workouts.filter(
                (w: Workout) => !existingIds.has(w.id),
              );

              return {
                workoutHistory: [...newWorkouts, ...state.workoutHistory],
                isLoading: false,
              };
            });
          }
        } catch (error) {
          console.error("Failed to load workouts:", error);
          set({ isLoading: false });
        }
      },

      // Sync all unsynced workouts
      syncWorkouts: async () => {
        const { workoutHistory, saveToDatabase } = get();
        const unsynced = workoutHistory.filter((w) => !w.synced);

        if (unsynced.length === 0) return;

        set({ isSyncing: true });

        try {
          await Promise.all(unsynced.map((w) => saveToDatabase(w)));
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "workout-storage", // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        currentWorkout: state.currentWorkout,
        workoutHistory: state.workoutHistory.slice(0, 50), // Keep last 50 workouts
      }),
    },
  ),
);
