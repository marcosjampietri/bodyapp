import { render, screen, fireEvent } from "@testing-library/react";
import WorkoutControls from "../components/WorkoutControls";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";
import { ThemeProvider } from "@/app/context/ThemeContext";

jest.mock("@/app/stores/WorkoutStore");

const mockCompleteWorkout = jest.fn();
const mockCancelWorkout = jest.fn();

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("WorkoutControls", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockExercises = [
    {
      id: "ex1",
      name: "Bench Press",
      sets: [{ id: "s1", weight: 100, reps: 10, completed: false }],
      completed: false,
      order: 0,
    },
  ];

  test("renders nothing when no exercises", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [] },
      completeWorkout: mockCompleteWorkout,
      cancelWorkout: mockCancelWorkout,
    });

    const { container } = renderWithTheme(<WorkoutControls />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders SAVE and CLEAR buttons when exercises exist", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: mockExercises },
      completeWorkout: mockCompleteWorkout,
      cancelWorkout: mockCancelWorkout,
    });

    renderWithTheme(<WorkoutControls />);
    expect(screen.getByText("SAVE")).toBeInTheDocument();
    expect(screen.getByText("CLEAR")).toBeInTheDocument();
  });

  test("calls completeWorkout when SAVE is clicked and confirmed", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: mockExercises },
      completeWorkout: mockCompleteWorkout,
      cancelWorkout: mockCancelWorkout,
    });

    renderWithTheme(<WorkoutControls />);

    // Click SAVE to open modal
    fireEvent.click(screen.getByText("SAVE"));

    // Click FINISH WORKOUT in modal
    fireEvent.click(screen.getByText("FINISH WORKOUT"));

    expect(mockCompleteWorkout).toHaveBeenCalled();
  });

  test("calls cancelWorkout when CLEAR is clicked", () => {
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: mockExercises },
      completeWorkout: mockCompleteWorkout,
      cancelWorkout: mockCancelWorkout,
    });

    renderWithTheme(<WorkoutControls />);
    fireEvent.click(screen.getByText("CLEAR"));
    expect(mockCancelWorkout).toHaveBeenCalled();

    window.confirm = originalConfirm;
  });

  test("does not call cancelWorkout when CLEAR is cancelled", () => {
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => false);

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: mockExercises },
      completeWorkout: mockCompleteWorkout,
      cancelWorkout: mockCancelWorkout,
    });

    renderWithTheme(<WorkoutControls />);
    fireEvent.click(screen.getByText("CLEAR"));
    expect(mockCancelWorkout).not.toHaveBeenCalled();

    window.confirm = originalConfirm;
  });
});
