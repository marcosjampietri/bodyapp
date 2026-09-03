import { render, screen, fireEvent } from "@testing-library/react";
import History from "../History";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  useParams: () => ({ name: "Bench Press" }),
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock("@/app/stores/WorkoutStore");

describe("ExerciseHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHistory = [
    {
      id: "w1",
      name: "Workout 1",
      date: new Date("2024-01-15T10:00:00"),
      exercises: [
        {
          id: "ex1",
          name: "Bench Press",
          sets: [
            { id: "s1", weight: 100, reps: 10, completed: true },
            { id: "s2", weight: 110, reps: 8, completed: true },
          ],
          completed: true,
          order: 0,
        },
        {
          id: "ex2",
          name: "Squat",
          sets: [{ id: "s3", weight: 140, reps: 5, completed: true }],
          completed: true,
          order: 1,
        },
      ],
      completed: true,
      synced: true,
    },
    {
      id: "w2",
      name: "Workout 2",
      date: new Date("2024-01-14T15:30:00"),
      exercises: [
        {
          id: "ex1",
          name: "Bench Press",
          sets: [{ id: "s4", weight: 105, reps: 9, completed: true }],
          completed: true,
          order: 0,
        },
      ],
      completed: true,
      synced: true,
    },
  ];

  const mockExerciseName = "Bench Press";

  test("renders history header", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: mockHistory,
    });

    render(<History exerciseName={mockExerciseName} />);
    expect(screen.getByText(/History/)).toBeInTheDocument();
  });

  test("shows all occurrences of the exercise", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: mockHistory,
    });

    render(<History exerciseName={mockExerciseName} />);
    expect(screen.getByText("15/01/24")).toBeInTheDocument();
    expect(screen.getByText("14/01/24")).toBeInTheDocument();
  });

  test("shows no history message when no occurrences", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: [],
    });

    render(<History exerciseName="Nonexistent" />);
    expect(
      screen.getByText("No history for this exercise yet"),
    ).toBeInTheDocument();
  });

  test("expands sets when clicked", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: mockHistory,
    });

    render(<History exerciseName={mockExerciseName} />);

    const expandButtons = screen.getAllByText("▼");
    fireEvent.click(expandButtons[0]);

    expect(screen.getByText("105 KG")).toBeInTheDocument();
  });

  test("collapses sets when clicked again", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: mockHistory,
    });

    render(<History exerciseName={mockExerciseName} />);

    const expandButtons = screen.getAllByText("▼");
    fireEvent.click(expandButtons[0]);
    fireEvent.click(expandButtons[0]);

    expect(screen.getAllByText("▼")[0]).toBeInTheDocument();
  });

  test("shows RPE if present", () => {
    const historyWithRpe = [
      {
        ...mockHistory[0],
        exercises: [
          {
            id: "ex1",
            name: "Bench Press",
            sets: [
              { id: "s1", weight: 100, reps: 10, completed: true, rpe: 8 },
            ],
            completed: true,
            order: 0,
          },
        ],
      },
    ];

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: historyWithRpe,
    });

    render(<History exerciseName={mockExerciseName} />);
    const expandButtons = screen.getAllByText("▼");
    fireEvent.click(expandButtons[0]);
    expect(screen.getByText("RPE 8")).toBeInTheDocument();
  });
});
