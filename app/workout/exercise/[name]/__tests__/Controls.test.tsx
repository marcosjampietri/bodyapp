import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Controls from "../Controls";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the store
jest.mock("@/app/stores/WorkoutStore");

const mockRouter = {
  back: jest.fn(),
};

const mockAddSet = jest.fn();
const mockRemoveSet = jest.fn();
const mockRemoveExercise = jest.fn();

describe("Controls", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const mockExercise = {
    id: "ex1",
    name: "Bench Press",
    sets: [
      { id: "set1", weight: 100, reps: 10, completed: false },
      { id: "set2", weight: 110, reps: 8, completed: false },
    ],
    completed: false,
    order: 0,
  };

  test("renders all three buttons", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      addSet: mockAddSet,
      removeSet: mockRemoveSet,
      removeExercise: mockRemoveExercise,
    });

    render(<Controls exerciseId="ex1" />);

    expect(screen.getByText("ADD SET")).toBeInTheDocument();
    expect(screen.getByText("DELETE SET")).toBeInTheDocument();
    expect(screen.getByText("DELETE ALL")).toBeInTheDocument();
  });

  test("adds a set when ADD SET is clicked", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      addSet: mockAddSet,
      removeSet: mockRemoveSet,
      removeExercise: mockRemoveExercise,
    });

    render(<Controls exerciseId="ex1" />);

    const addButton = screen.getByText("ADD SET");
    fireEvent.click(addButton);

    expect(mockAddSet).toHaveBeenCalledWith("ex1");
  });

  test("removes last set when DELETE SET is clicked", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      addSet: mockAddSet,
      removeSet: mockRemoveSet,
      removeExercise: mockRemoveExercise,
    });

    render(<Controls exerciseId="ex1" />);

    const deleteButton = screen.getByText("DELETE SET");
    fireEvent.click(deleteButton);

    expect(mockRemoveSet).toHaveBeenCalledWith("ex1", "set2");
  });

  test("does nothing when DELETE SET is clicked and only one set exists", () => {
    const singleSetExercise = {
      ...mockExercise,
      sets: [{ id: "set1", weight: 100, reps: 10, completed: false }],
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [singleSetExercise] },
      addSet: mockAddSet,
      removeSet: mockRemoveSet,
      removeExercise: mockRemoveExercise,
    });

    render(<Controls exerciseId="ex1" />);

    const deleteButton = screen.getByText("DELETE SET");
    fireEvent.click(deleteButton);

    expect(mockRemoveSet).not.toHaveBeenCalled();
  });

  test("removes exercise and navigates back when DELETE ALL is clicked", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      addSet: mockAddSet,
      removeSet: mockRemoveSet,
      removeExercise: mockRemoveExercise,
    });

    render(<Controls exerciseId="ex1" />);

    const deleteAllButton = screen.getByText("DELETE ALL");
    fireEvent.click(deleteAllButton);

    expect(mockRemoveExercise).toHaveBeenCalledWith("ex1");
    expect(mockRouter.back).toHaveBeenCalled();
  });

  test("returns null if exercise not found", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [] },
      addSet: mockAddSet,
      removeSet: mockRemoveSet,
      removeExercise: mockRemoveExercise,
    });

    const { container } = render(<Controls exerciseId="nonexistent" />);
    expect(container).toBeEmptyDOMElement();
  });

  test("returns null if no current workout", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: null,
      addSet: mockAddSet,
      removeSet: mockRemoveSet,
      removeExercise: mockRemoveExercise,
    });

    const { container } = render(<Controls exerciseId="ex1" />);
    expect(container).toBeEmptyDOMElement();
  });
});
