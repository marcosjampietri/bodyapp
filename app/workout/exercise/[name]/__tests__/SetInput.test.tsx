import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SetInput from "../components/SetInput";
import { useWorkoutStore } from "../../../../stores/WorkoutStore";

import { ThemeProvider } from "@/app/context/ThemeContext";
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

// Mock the store
jest.mock("../../../../stores/WorkoutStore");

const mockUpdateSet = jest.fn();

const mockExercise = {
  id: "123",
  name: "Bench Press",
  sets: [
    { id: "set1", weight: 0, reps: 0, completed: false },
    { id: "set2", weight: 50, reps: 10, completed: true },
  ],
  settings: {
    splitWeight: false,
    barWeight: 20,
  },
};

describe("SetInput", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock the store state
    (useWorkoutStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        currentWorkout: {
          exercises: [mockExercise],
        },
        updateSet: mockUpdateSet,
      };
      return selector ? selector(state) : state;
    });
  });

  test("renders all sets", () => {
    renderWithTheme(<SetInput exerciseId="123" />);

    // Check if set numbers are rendered
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("allows editing empty set", () => {
    renderWithTheme(<SetInput exerciseId="123" />);

    const repsInput = screen.getAllByPlaceholderText("Reps")[0];
    const weightInput = screen.getAllByPlaceholderText("Weight")[0];

    // Type in reps
    fireEvent.change(repsInput, { target: { value: "12" } });
    expect(mockUpdateSet).toHaveBeenCalledWith(
      "123",
      "set1",
      expect.objectContaining({ reps: 12 }),
    );
    mockUpdateSet.mockClear();

    // Type in weight
    fireEvent.change(weightInput, { target: { value: "85.5" } });
    expect(mockUpdateSet).toHaveBeenCalledWith(
      "123",
      "set1",
      expect.objectContaining({ weight: 85.5 }),
    );
  });

  test("prevents multiple dots in weight", () => {
    renderWithTheme(<SetInput exerciseId="123" />);

    const firstWeightInput = screen.getAllByPlaceholderText("Weight")[0];

    // Try to type "1.2.3"
    fireEvent.change(firstWeightInput, { target: { value: "1.2.3" } });
    // Should not update with invalid value
    expect(mockUpdateSet).not.toHaveBeenCalledWith(
      "123",
      "set1",
      expect.objectContaining({ weight: 1.23 }),
    );
  });

  test("prevents letters in input", () => {
    renderWithTheme(<SetInput exerciseId="123" />);

    const firstRepsInput = screen.getAllByPlaceholderText("Reps")[0];
    fireEvent.change(firstRepsInput, { target: { value: "abc" } });

    // Should not update
    expect(mockUpdateSet).not.toHaveBeenCalled();
  });

  test("locks second set when first is incomplete", () => {
    // Create a workout with first set incomplete
    const incompleteExercise = {
      id: "123",
      name: "Bench Press",
      sets: [
        { id: "set1", weight: 10, reps: 0, completed: false }, // INCOMPLETE
        { id: "set2", weight: 0, reps: 0, completed: false }, // Should be locked
      ],
      settings: {
        splitWeight: false,
        barWeight: 20,
      },
    };

    // Mock the store
    (useWorkoutStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        currentWorkout: {
          exercises: [incompleteExercise],
        },
        updateSet: mockUpdateSet,
      };
      return selector ? selector(state) : state;
    });

    renderWithTheme(<SetInput exerciseId="123" />);

    const allInputs = screen.getAllByPlaceholderText("—");
    const set2RepsInput = allInputs[0];

    // Should be disabled because set1 is incomplete
    expect(set2RepsInput).toBeDisabled();
  });

  test("shows total weight calculation", () => {
    // Exercise with splitWeight true
    const exerciseWithSplit = {
      ...mockExercise,
      sets: [{ id: "set1", weight: 50, reps: 10, completed: false }],
      settings: { splitWeight: true, barWeight: 20 },
    };

    (useWorkoutStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        currentWorkout: {
          exercises: [exerciseWithSplit],
        },
        updateSet: mockUpdateSet,
      };
      return selector ? selector(state) : state;
    });

    renderWithTheme(<SetInput exerciseId="123" />);

    // Should show "= 120" (50*2 + 20)
    expect(screen.getByText("= 120")).toBeInTheDocument();
  });
});
