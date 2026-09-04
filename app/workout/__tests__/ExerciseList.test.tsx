import { render, screen } from "@testing-library/react";
import ExerciseList from "../components/ExerciseList";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";
import { ThemeProvider } from "@/app/context/ThemeContext";

jest.mock("@/app/stores/WorkoutStore");

const mockCompleteExercise = jest.fn();

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("ExerciseList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockExercises = [
    {
      id: "ex1",
      name: "Bench Press",
      sets: [
        { id: "s1", weight: 100, reps: 10, completed: false },
        { id: "s2", weight: 110, reps: 8, completed: false },
      ],
      primaryMuscles: ["chest"],
      equipment: "barbell",
      completed: false,
      order: 0,
    },
    {
      id: "ex2",
      name: "Squat",
      sets: [{ id: "s3", weight: 140, reps: 5, completed: false }],
      primaryMuscles: ["legs"],
      equipment: "barbell",
      completed: false,
      order: 1,
    },
  ];

  test("renders exercise list", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: mockExercises },
      completeExercise: mockCompleteExercise,
    });

    renderWithTheme(<ExerciseList />);
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Squat")).toBeInTheDocument();
  });

  test("shows exercise count and reps range", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: mockExercises },
      completeExercise: mockCompleteExercise,
    });

    renderWithTheme(<ExerciseList />);
    expect(screen.getByText(/2\s+sets/)).toBeInTheDocument();
    expect(screen.getByText(/8\s*-\s*10\s+reps/)).toBeInTheDocument();
    expect(screen.getByText(/1\s+sets/)).toBeInTheDocument();
    expect(screen.getByText(/5\s+reps/)).toBeInTheDocument();
  });

  test("displays completed status correctly", () => {
    const completedExercise = {
      ...mockExercises[0],
      completed: true,
      sets: [{ id: "s1", weight: 100, reps: 10, completed: false }],
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [completedExercise] },
      completeExercise: mockCompleteExercise,
    });

    renderWithTheme(<ExerciseList />);
    expect(screen.getByText("✓ Done")).toBeInTheDocument();
  });

  test("renders empty div when no current workout", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: null,
      completeExercise: mockCompleteExercise,
    });

    const { container } = renderWithTheme(<ExerciseList />);
    // Your component returns <div className="space-y-1"></div> when empty
    expect(container.firstChild).toHaveClass("space-y-1");
    expect(container.firstChild?.childNodes.length).toBe(0);
  });

  test("renders empty div when no exercises", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [] },
      completeExercise: mockCompleteExercise,
    });

    const { container } = renderWithTheme(<ExerciseList />);
    expect(container.firstChild).toHaveClass("space-y-1");
    expect(container.firstChild?.childNodes.length).toBe(0);
  });
});
