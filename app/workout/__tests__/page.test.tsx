import { render, screen } from "@testing-library/react";
import WorkoutPage from "../page";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";

jest.mock("@/app/stores/WorkoutStore");
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("WorkoutPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders workout page with exercises", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: {
        id: "w1",
        name: "Test Workout",
        date: new Date(),
        exercises: [
          {
            id: "ex1",
            name: "Bench Press",
            sets: [{ id: "s1", weight: 100, reps: 10, completed: false }],
            primaryMuscles: ["chest"],
            equipment: "barbell",
            completed: false,
            order: 0,
          },
        ],
        completed: false,
        synced: false,
      },
      workoutHistory: [],
      createWorkout: jest.fn(),
    });

    render(<WorkoutPage />);
    expect(screen.getByText("⚡ Workout")).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("+ Add Exercise")).toBeInTheDocument();
  });

  test("shows build buttons when no exercises", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: {
        id: "w1",
        name: "Empty Workout",
        date: new Date(),
        exercises: [],
        completed: false,
        synced: false,
      },
      workoutHistory: [],
      createWorkout: jest.fn(),
    });

    render(<WorkoutPage />);
    expect(screen.getByText("Build New Workout")).toBeInTheDocument();
    expect(screen.getByText("Load from History")).toBeInTheDocument();
  });
});
