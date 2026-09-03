import { render, screen, fireEvent } from "@testing-library/react";
import HistoryPage from "../page";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";

jest.mock("@/app/stores/WorkoutStore");
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("HistoryPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockWorkoutHistory = [
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
          id: "ex3",
          name: "Deadlift",
          sets: [{ id: "s4", weight: 180, reps: 5, completed: true }],
          completed: true,
          order: 0,
        },
      ],
      completed: true,
      synced: true,
    },
  ];

  test("renders history page", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: mockWorkoutHistory,
      loadFromDatabase: jest.fn(),
    });

    render(<HistoryPage />);
    expect(screen.getByText("History")).toBeInTheDocument();
  });

  test("shows no history message when empty", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: [],
      loadFromDatabase: jest.fn(),
    });

    render(<HistoryPage />);
    expect(screen.getByText("No workout history yet")).toBeInTheDocument();
  });

  test("displays workout dates", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: mockWorkoutHistory,
      loadFromDatabase: jest.fn(),
    });

    render(<HistoryPage />);
    expect(screen.getByText("15/01/24 10:00")).toBeInTheDocument();
    expect(screen.getByText("14/01/24 15:30")).toBeInTheDocument();
  });

  test("selects first workout by default", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: mockWorkoutHistory,
      loadFromDatabase: jest.fn(),
    });

    render(<HistoryPage />);
    // Use getAllByText since "Bench Press" appears twice
    const benchPressElements = screen.getAllByText("Bench Press");
    expect(benchPressElements.length).toBe(2);
    expect(benchPressElements[0]).toBeInTheDocument();
    expect(screen.getByText("Squat")).toBeInTheDocument();
  });

  test("selects workout when date is clicked", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: mockWorkoutHistory,
      loadFromDatabase: jest.fn(),
    });

    render(<HistoryPage />);

    const dateButton = screen.getByText("14/01/24 15:30");
    fireEvent.click(dateButton);

    const deadliftElements = screen.getAllByText("Deadlift");
    expect(deadliftElements.length).toBe(2);
    expect(deadliftElements[0]).toBeInTheDocument();
  });

  // test("expands exercise when clicked", () => {
  //   (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
  //     workoutHistory: mockWorkoutHistory,
  //     loadFromDatabase: jest.fn(),
  //   });

  //   render(<HistoryPage />);

  //   // Click the exercise in the list (second occurrence)
  //   const benchPressElements = screen.getAllByText("Bench Press");
  //   fireEvent.click(benchPressElements[1]);

  //   expect(screen.getByText("10 × 100 KG")).toBeInTheDocument();
  //   expect(screen.getByText("8 × 110 KG")).toBeInTheDocument();
  // });

  test("shows redo workout button for selected workout", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: mockWorkoutHistory,
      loadFromDatabase: jest.fn(),
    });

    render(<HistoryPage />);
    expect(screen.getByText("Redo Workout")).toBeInTheDocument();
  });

  test("toggles calendar modal", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      workoutHistory: mockWorkoutHistory,
      loadFromDatabase: jest.fn(),
    });

    render(<HistoryPage />);

    const calendarButton = screen.getByText("📅");
    fireEvent.click(calendarButton);

    expect(screen.getByText("Close")).toBeInTheDocument();
  });
});
