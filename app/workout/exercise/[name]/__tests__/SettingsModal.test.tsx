import { render, screen, fireEvent } from "@testing-library/react";
import SettingsModal from "../SettingsModal";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";

jest.mock("@/app/stores/WorkoutStore");

const mockUpdateExerciseSettings = jest.fn();

describe("SettingsModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockExercise = {
    id: "ex1",
    name: "Bench Press",
    sets: [{ id: "set1", weight: 100, reps: 10, completed: false }],
    settings: {
      splitWeight: false,
      barWeight: 0,
    },
    completed: false,
    order: 0,
  };

  test("renders nothing when isOpen is false", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    const { container } = render(
      <SettingsModal isOpen={false} onClose={jest.fn()} exerciseId="ex1" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders modal when isOpen is true", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    render(
      <SettingsModal isOpen={true} onClose={jest.fn()} exerciseId="ex1" />,
    );

    expect(screen.getByText("SPLIT")).toBeInTheDocument();
    expect(screen.getByText("ADD BAR")).toBeInTheDocument();
    expect(screen.getByText("DONE")).toBeInTheDocument();
  });

  test("toggles split weight when clicked", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    render(
      <SettingsModal isOpen={true} onClose={jest.fn()} exerciseId="ex1" />,
    );

    const splitButton = screen.getByText("SPLIT");
    fireEvent.click(splitButton);

    const doneButton = screen.getByText("DONE");
    fireEvent.click(doneButton);

    expect(mockUpdateExerciseSettings).toHaveBeenCalledWith("ex1", {
      splitWeight: false,
      barWeight: 0,
    });
  });

  test("toggles ADD BAR when clicked", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    render(
      <SettingsModal isOpen={true} onClose={jest.fn()} exerciseId="ex1" />,
    );

    const addBarButton = screen.getByText("ADD BAR");
    fireEvent.click(addBarButton);

    const doneButton = screen.getByText("DONE");
    fireEvent.click(doneButton);

    expect(mockUpdateExerciseSettings).toHaveBeenCalledWith("ex1", {
      splitWeight: false,
      barWeight: 0,
    });
  });

  test("shows bar weight input when ADD BAR is enabled", () => {
    const exerciseWithBar = {
      ...mockExercise,
      settings: {
        splitWeight: false,
        barWeight: 20,
      },
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [exerciseWithBar] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    render(
      <SettingsModal isOpen={true} onClose={jest.fn()} exerciseId="ex1" />,
    );

    expect(screen.getByText("BAR WEIGHT:")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
  });

  test("allows changing bar weight", () => {
    const exerciseWithBar = {
      ...mockExercise,
      settings: {
        splitWeight: false,
        barWeight: 20,
      },
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [exerciseWithBar] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    render(
      <SettingsModal isOpen={true} onClose={jest.fn()} exerciseId="ex1" />,
    );

    const barInput = screen.getByDisplayValue("20");
    fireEvent.change(barInput, { target: { value: "45" } });

    const doneButton = screen.getByText("DONE");
    fireEvent.click(doneButton);

    expect(mockUpdateExerciseSettings).toHaveBeenCalledWith("ex1", {
      splitWeight: false,
      barWeight: 45,
    });
  });

  test("prevents non-numeric input in bar weight", () => {
    const exerciseWithBar = {
      ...mockExercise,
      settings: {
        splitWeight: false,
        barWeight: 20,
      },
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [exerciseWithBar] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    render(
      <SettingsModal isOpen={true} onClose={jest.fn()} exerciseId="ex1" />,
    );

    const barInput = screen.getByDisplayValue("20");
    fireEvent.change(barInput, { target: { value: "abc" } });

    expect(barInput).toHaveValue("20");
  });

  test("calls onClose when DONE is clicked", () => {
    const onClose = jest.fn();

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    render(<SettingsModal isOpen={true} onClose={onClose} exerciseId="ex1" />);

    const doneButton = screen.getByText("DONE");
    fireEvent.click(doneButton);

    expect(onClose).toHaveBeenCalled();
  });

  test("renders modal with default settings when exercise not found", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    render(
      <SettingsModal
        isOpen={true}
        onClose={jest.fn()}
        exerciseId="nonexistent"
      />,
    );

    expect(screen.getByText("SPLIT")).toBeInTheDocument();
    expect(screen.getByText("ADD BAR")).toBeInTheDocument();
    expect(screen.getByText("DONE")).toBeInTheDocument();
  });

  test("initializes state from exercise settings", () => {
    const exerciseWithSettings = {
      ...mockExercise,
      settings: {
        splitWeight: true,
        barWeight: 45,
      },
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [exerciseWithSettings] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    render(
      <SettingsModal isOpen={true} onClose={jest.fn()} exerciseId="ex1" />,
    );

    expect(screen.getByText("SPLIT")).toHaveClass("text-cyan-300");
    expect(screen.getByDisplayValue("45")).toBeInTheDocument();
  });

  test("calls updateExerciseSettings with splitWeight and barWeight", () => {
    // Mock with bar already enabled
    const exerciseWithBar = {
      ...mockExercise,
      settings: {
        splitWeight: false,
        barWeight: 20, // Start with bar enabled
      },
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [exerciseWithBar] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    render(
      <SettingsModal isOpen={true} onClose={jest.fn()} exerciseId="ex1" />,
    );

    const splitButton = screen.getByText("SPLIT");
    fireEvent.click(splitButton);

    // Bar input should already be visible since barWeight is 20
    const barInput = screen.getByTestId("bar-weight-input");
    fireEvent.change(barInput, { target: { value: "30" } });

    const doneButton = screen.getByText("DONE");
    fireEvent.click(doneButton);

    expect(mockUpdateExerciseSettings).toHaveBeenCalledWith("ex1", {
      splitWeight: false,
      barWeight: 30,
    });
  });
});
