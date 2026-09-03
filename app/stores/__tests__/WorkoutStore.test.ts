import { useWorkoutStore } from "../WorkoutStore";

// Mock fetch globally
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
    }),
  ) as jest.Mock;
});

// Reset store before each test
beforeEach(() => {
  useWorkoutStore.setState({
    currentWorkout: null,
    workoutHistory: [],
    isLoading: false,
    isSyncing: false,
  });
  jest.clearAllMocks();
});

// Helper to create a test exercise
const createTestExercise = (id: string, name: string) => ({
  _id: `test_${id}`,
  id: id,
  name: name,
  force: "push" as const,
  level: "intermediate" as const,
  mechanic: "compound" as const,
  equipment: "barbell",
  primaryMuscles: ["chest"],
  secondaryMuscles: ["triceps"],
  instructions: ["Lie down", "Press up"],
  category: "strength",
  images: ["test.jpg"],
});

describe("WorkoutStore", () => {
  describe("createWorkout", () => {
    test("creates a new workout with given name", () => {
      const { createWorkout } = useWorkoutStore.getState();
      createWorkout("Morning Workout");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout).not.toBeNull();
      expect(currentWorkout?.name).toBe("Morning Workout");
      expect(currentWorkout?.exercises).toEqual([]);
      expect(currentWorkout?.completed).toBe(false);
      expect(currentWorkout?.synced).toBe(false);
      expect(currentWorkout?.id).toBeDefined();
    });

    test("creates workout with default name if none provided", () => {
      const { createWorkout } = useWorkoutStore.getState();
      createWorkout("");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout?.name).toContain("Workout");
    });
  });

  describe("addExercise", () => {
    test("adds exercise to current workout", () => {
      const { createWorkout, addExercise } = useWorkoutStore.getState();
      createWorkout("Test Workout");
      const exercise = createTestExercise("ex1", "Bench Press");
      addExercise(exercise);
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout?.exercises).toHaveLength(1);
      expect(currentWorkout?.exercises[0].name).toBe("Bench Press");
      expect(currentWorkout?.exercises[0].sets).toHaveLength(1);
      expect(currentWorkout?.exercises[0].sets[0].weight).toBe(0);
      expect(currentWorkout?.exercises[0].sets[0].reps).toBe(0);
      expect(currentWorkout?.exercises[0].order).toBe(0);
    });

    test("creates workout if none exists", () => {
      const { addExercise } = useWorkoutStore.getState();
      const exercise = createTestExercise("ex1", "Bench Press");
      addExercise(exercise);
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout).not.toBeNull();
      expect(currentWorkout?.exercises).toHaveLength(1);
      expect(currentWorkout?.exercises[0].name).toBe("Bench Press");
    });
  });

  describe("removeExercise", () => {
    test("removes exercise from current workout", () => {
      const { createWorkout, addExercise, removeExercise } =
        useWorkoutStore.getState();
      createWorkout("Test Workout");
      const exercise1 = createTestExercise("ex1", "Bench Press");
      const exercise2 = createTestExercise("ex2", "Squat");
      addExercise(exercise1);
      addExercise(exercise2);
      removeExercise("ex1");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout?.exercises).toHaveLength(1);
      expect(currentWorkout?.exercises[0].name).toBe("Squat");
    });

    test("does nothing if no current workout", () => {
      const { removeExercise } = useWorkoutStore.getState();
      removeExercise("ex1");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout).toBeNull();
    });
  });

  describe("addSet", () => {
    test("adds a set to an exercise", () => {
      const { createWorkout, addExercise, addSet } = useWorkoutStore.getState();
      createWorkout("Test Workout");
      const exercise = createTestExercise("ex1", "Bench Press");
      addExercise(exercise);
      addSet("ex1");
      const { currentWorkout } = useWorkoutStore.getState();
      const exerciseInStore = currentWorkout?.exercises[0];
      expect(exerciseInStore?.sets).toHaveLength(2);
      expect(exerciseInStore?.sets[1].weight).toBe(0);
      expect(exerciseInStore?.sets[1].reps).toBe(0);
      expect(exerciseInStore?.sets[1].completed).toBe(false);
      expect(exerciseInStore?.sets[1].id).toBeDefined();
    });

    test("does nothing if no current workout", () => {
      const { addSet } = useWorkoutStore.getState();
      addSet("ex1");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout).toBeNull();
    });

    test("does nothing if exercise not found", () => {
      const { createWorkout, addSet } = useWorkoutStore.getState();
      createWorkout("Test Workout");
      addSet("nonexistent");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout?.exercises).toHaveLength(0);
    });
  });

  describe("removeSet", () => {
    test("removes a set from an exercise", () => {
      const { createWorkout, addExercise, removeSet } =
        useWorkoutStore.getState();
      createWorkout("Test Workout");
      const exercise = createTestExercise("ex1", "Bench Press");
      addExercise(exercise);
      const { currentWorkout } = useWorkoutStore.getState();
      const setId = currentWorkout?.exercises[0].sets[0].id!;
      removeSet("ex1", setId);
      const updated = useWorkoutStore.getState();
      expect(updated.currentWorkout?.exercises[0].sets).toHaveLength(0);
    });

    test("does nothing if no current workout", () => {
      const { removeSet } = useWorkoutStore.getState();
      removeSet("ex1", "set1");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout).toBeNull();
    });
  });

  describe("updateSet", () => {
    test("updates a set with new data", () => {
      const { createWorkout, addExercise, updateSet } =
        useWorkoutStore.getState();
      createWorkout("Test Workout");
      const exercise = createTestExercise("ex1", "Bench Press");
      addExercise(exercise);
      const { currentWorkout } = useWorkoutStore.getState();
      const setId = currentWorkout?.exercises[0].sets[0].id!;
      updateSet("ex1", setId, { weight: 100, reps: 10 });
      const updated = useWorkoutStore.getState();
      expect(updated.currentWorkout?.exercises[0].sets[0].weight).toBe(100);
      expect(updated.currentWorkout?.exercises[0].sets[0].reps).toBe(10);
    });

    test("updates a set with rpe", () => {
      const { createWorkout, addExercise, updateSet } =
        useWorkoutStore.getState();
      createWorkout("Test Workout");
      const exercise = createTestExercise("ex1", "Bench Press");
      addExercise(exercise);
      const { currentWorkout } = useWorkoutStore.getState();
      const setId = currentWorkout?.exercises[0].sets[0].id!;
      updateSet("ex1", setId, { weight: 100, reps: 10, rpe: 8 });
      const updated = useWorkoutStore.getState();
      expect(updated.currentWorkout?.exercises[0].sets[0].rpe).toBe(8);
    });

    test("does nothing if no current workout", () => {
      const { updateSet } = useWorkoutStore.getState();
      updateSet("ex1", "set1", { weight: 100 });
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout).toBeNull();
    });
  });

  describe("completeExercise", () => {
    test("toggles exercise completion status", () => {
      const { createWorkout, addExercise, completeExercise } =
        useWorkoutStore.getState();
      createWorkout("Test Workout");
      const exercise = createTestExercise("ex1", "Bench Press");
      addExercise(exercise);
      completeExercise("ex1");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout?.exercises[0].completed).toBe(true);
      completeExercise("ex1");
      const updated = useWorkoutStore.getState();
      expect(updated.currentWorkout?.exercises[0].completed).toBe(false);
    });

    test("does nothing if no current workout", () => {
      const { completeExercise } = useWorkoutStore.getState();
      completeExercise("ex1");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout).toBeNull();
    });
  });

  describe("updateExerciseOrder", () => {
    test("reorders exercises", () => {
      const { createWorkout, addExercise, updateExerciseOrder } =
        useWorkoutStore.getState();
      createWorkout("Test Workout");
      const exercise1 = createTestExercise("ex1", "Bench Press");
      const exercise2 = createTestExercise("ex2", "Squat");
      addExercise(exercise1);
      addExercise(exercise2);
      updateExerciseOrder("ex2", 0);
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout?.exercises[0].name).toBe("Squat");
      expect(currentWorkout?.exercises[0].order).toBe(0);
      expect(currentWorkout?.exercises[1].name).toBe("Bench Press");
      expect(currentWorkout?.exercises[1].order).toBe(1);
    });
  });

  describe("updateExerciseSettings", () => {
    test("updates exercise settings", () => {
      const { createWorkout, addExercise, updateExerciseSettings } =
        useWorkoutStore.getState();
      createWorkout("Test Workout");
      const exercise = createTestExercise("ex1", "Bench Press");
      addExercise(exercise);
      updateExerciseSettings("ex1", { splitWeight: true, barWeight: 20 });
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout?.exercises[0].settings?.splitWeight).toBe(true);
      expect(currentWorkout?.exercises[0].settings?.barWeight).toBe(20);
    });
  });

  describe("completeWorkout", () => {
    test("completes workout and saves to history", async () => {
      const { createWorkout, addExercise, completeWorkout } =
        useWorkoutStore.getState();
      createWorkout("Test Workout");
      const exercise = createTestExercise("ex1", "Bench Press");
      addExercise(exercise);
      completeWorkout();
      await new Promise((resolve) => setTimeout(resolve, 0));
      const { currentWorkout, workoutHistory } = useWorkoutStore.getState();
      expect(currentWorkout).toBeNull();
      expect(workoutHistory).toHaveLength(1);
      expect(workoutHistory[0].completed).toBe(true);
    });
  });

  describe("cancelWorkout", () => {
    test("cancels current workout", () => {
      const { createWorkout, cancelWorkout } = useWorkoutStore.getState();
      createWorkout("Test Workout");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout).not.toBeNull();
      cancelWorkout();
      const updated = useWorkoutStore.getState();
      expect(updated.currentWorkout).toBeNull();
    });
  });

  describe("updateWorkoutNotes", () => {
    test("updates workout notes", () => {
      const { createWorkout, updateWorkoutNotes } = useWorkoutStore.getState();
      createWorkout("Test Workout");
      updateWorkoutNotes("Great workout!");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout?.notes).toBe("Great workout!");
    });
  });

  describe("updateExerciseNotes", () => {
    test("updates exercise notes", () => {
      const { createWorkout, addExercise, updateExerciseNotes } =
        useWorkoutStore.getState();
      createWorkout("Test Workout");
      const exercise = createTestExercise("ex1", "Bench Press");
      addExercise(exercise);
      updateExerciseNotes("ex1", "Focus on form");
      const { currentWorkout } = useWorkoutStore.getState();
      expect(currentWorkout?.exercises[0].notes).toBe("Focus on form");
    });
  });

  describe("clearCurrentWorkout", () => {
    test("clears current workout", () => {
      const { createWorkout, clearCurrentWorkout } = useWorkoutStore.getState();
      createWorkout("Test Workout");
      expect(useWorkoutStore.getState().currentWorkout).not.toBeNull();
      clearCurrentWorkout();
      expect(useWorkoutStore.getState().currentWorkout).toBeNull();
    });
  });
});
