import { render, screen, fireEvent } from "@testing-library/react";
import Settings from "../components/Settings";
import { useWorkoutStore } from "@/app/stores/WorkoutStore";
import { ThemeProvider } from "@/app/context/ThemeContext";

jest.mock("@/app/stores/WorkoutStore");

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

const mockUpdateExerciseSettings = jest.fn();

describe("Settings (WeightSettings)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockExercise = {
    _id: "ex1",
    slug: "bench-press",
    name: "Bench Press",
    primaryMuscles: ["chest"],
    equipment: "barbell",
    sets: [{ id: "set1", weight: 100, reps: 10, completed: false }],
    settings: {
      splitWeight: false,
      barEnabled: false,
      barWeight: 20,
    },
    completed: false,
    order: 0,
  };

  test("renders the header and gear button", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    renderWithTheme(<Settings exerciseId="ex1" />);

    expect(screen.getByText("Exercise Options")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight settings")).toBeInTheDocument();
  });

  test("panel is collapsed by default", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    renderWithTheme(<Settings exerciseId="ex1" />);

    expect(screen.queryByText("Weight Mode")).not.toBeInTheDocument();
    expect(screen.queryByText("Split ×2")).not.toBeInTheDocument();
  });

  test("opens panel when gear is clicked", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    renderWithTheme(<Settings exerciseId="ex1" />);

    fireEvent.click(screen.getByLabelText("Weight settings"));

    expect(screen.getByText("Weight Mode")).toBeInTheDocument();
    expect(screen.getByText("Split ×2")).toBeInTheDocument();
    expect(screen.getByText("Bar")).toBeInTheDocument();
  });

  test("toggles split weight", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    renderWithTheme(<Settings exerciseId="ex1" />);
    fireEvent.click(screen.getByLabelText("Weight settings"));
    fireEvent.click(screen.getByText("Split ×2"));

    expect(mockUpdateExerciseSettings).toHaveBeenCalledWith("ex1", {
      splitWeight: true,
    });
  });

  test("toggles bar on", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    renderWithTheme(<Settings exerciseId="ex1" />);
    fireEvent.click(screen.getByLabelText("Weight settings"));
    fireEvent.click(screen.getByText("Bar"));

    expect(mockUpdateExerciseSettings).toHaveBeenCalledWith("ex1", {
      barEnabled: true,
    });
  });

  test("toggles bar off when already enabled", () => {
    const exerciseWithBar = {
      ...mockExercise,
      settings: { ...mockExercise.settings, barEnabled: true },
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [exerciseWithBar] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    renderWithTheme(<Settings exerciseId="ex1" />);
    fireEvent.click(screen.getByLabelText("Weight settings"));
    fireEvent.click(screen.getByText("Bar"));

    expect(mockUpdateExerciseSettings).toHaveBeenCalledWith("ex1", {
      barEnabled: false,
    });
  });

  test("bar input is disabled when bar is off", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [mockExercise] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    renderWithTheme(<Settings exerciseId="ex1" />);
    fireEvent.click(screen.getByLabelText("Weight settings"));

    const barInput = screen.getByDisplayValue("20");
    expect(barInput).toBeDisabled();
  });

  test("bar input is enabled when bar is on", () => {
    const exerciseWithBar = {
      ...mockExercise,
      settings: { ...mockExercise.settings, barEnabled: true },
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [exerciseWithBar] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    renderWithTheme(<Settings exerciseId="ex1" />);
    fireEvent.click(screen.getByLabelText("Weight settings"));

    const barInput = screen.getByDisplayValue("20");
    expect(barInput).not.toBeDisabled();
  });

  test("updates bar weight on change", () => {
    const exerciseWithBar = {
      ...mockExercise,
      settings: { ...mockExercise.settings, barEnabled: true },
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [exerciseWithBar] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    renderWithTheme(<Settings exerciseId="ex1" />);
    fireEvent.click(screen.getByLabelText("Weight settings"));

    const barInput = screen.getByDisplayValue("20");
    fireEvent.change(barInput, { target: { value: "45" } });

    expect(mockUpdateExerciseSettings).toHaveBeenCalledWith("ex1", {
      barWeight: 45,
    });
  });

  test("prevents non-numeric input in bar weight", () => {
    const exerciseWithBar = {
      ...mockExercise,
      settings: { ...mockExercise.settings, barEnabled: true },
    };

    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [exerciseWithBar] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    renderWithTheme(<Settings exerciseId="ex1" />);
    fireEvent.click(screen.getByLabelText("Weight settings"));

    const barInput = screen.getByDisplayValue("20");
    fireEvent.change(barInput, { target: { value: "abc" } });

    // Should not call update with invalid value
    expect(mockUpdateExerciseSettings).not.toHaveBeenCalledWith("ex1", {
      barWeight: NaN,
    });
  });

  test("returns null if exercise not found", () => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      currentWorkout: { exercises: [] },
      updateExerciseSettings: mockUpdateExerciseSettings,
    });

    const { container } = renderWithTheme(
      <Settings exerciseId="nonexistent" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
