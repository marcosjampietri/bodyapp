import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SetInput from "../SetInput";
import { useWorkoutStore } from "../../../../stores/WorkoutStore";

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
    render(<SetInput exerciseId="123" />);

    // Check if set numbers are rendered
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("allows editing empty set", () => {
    render(<SetInput exerciseId="123" />);

    // Get ALL inputs with placeholder "0"
    const allInputs = screen.getAllByPlaceholderText("0");

    // For a set, the order is: [repsInput, weightInput]
    // So repsInputs[0] = reps, repsInputs[1] = weight
    const repsInput = allInputs[0];
    const weightInput = allInputs[1];

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
    render(<SetInput exerciseId="123" />);

    const weightInputs = screen.getAllByPlaceholderText("0");
    const firstWeightInput = weightInputs[0];

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
    render(<SetInput exerciseId="123" />);

    const repsInputs = screen.getAllByPlaceholderText("0");
    fireEvent.change(repsInputs[0], { target: { value: "abc" } });

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

    render(<SetInput exerciseId="123" />);

    // Get all inputs - they're in order: [set1_reps, set1_weight, set2_reps, set2_weight]
    const allInputs = screen.getAllByPlaceholderText("0");
    const set2RepsInput = allInputs[2]; // Third input is set2 reps

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

    render(<SetInput exerciseId="123" />);

    // Should show "= 120" (50*2 + 20)
    expect(screen.getByText("= 120")).toBeInTheDocument();
  });
});
