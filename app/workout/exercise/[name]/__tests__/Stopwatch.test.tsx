import { render, screen, fireEvent } from "@testing-library/react";
import Stopwatch from "../Stopwatch"; // Import from parent folder

// Mock the hook (from parent folder)
jest.mock("../useStopwatch");

import { useStopwatch } from "../useStopwatch";

const mockUseStopwatch = useStopwatch as jest.Mock;

describe("Stopwatch Component", () => {
  const mockToggle = jest.fn();
  const mockReset = jest.fn();
  const mockLap = jest.fn();
  const mockStart = jest.fn();
  const mockPause = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseStopwatch.mockReturnValue({
      time: 0,
      isRunning: false,
      isPaused: false,
      isComplete: false,
      start: mockStart,
      pause: mockPause,
      reset: mockReset,
      toggle: mockToggle,
      lap: mockLap,
      laps: [],
      formatTime: jest.fn().mockReturnValue("00:00"),
      formatTimeDetailed: jest.fn().mockReturnValue("00:00.0"),
      progress: 0,
      targetTime: null,
      setTarget: jest.fn(),
    });
  });

  test("renders timer display", () => {
    render(<Stopwatch />);
    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  test("renders preset buttons", () => {
    render(<Stopwatch />);
    expect(screen.getByText("30s")).toBeInTheDocument();
    expect(screen.getByText("1min")).toBeInTheDocument();
    expect(screen.getByText("5min")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  test("start button starts timer", () => {
    mockUseStopwatch.mockReturnValue({
      ...mockUseStopwatch(),
      toggle: mockToggle,
      isRunning: false,
    });

    render(<Stopwatch />);
    const startButton = screen.getByText("▶");
    fireEvent.click(startButton);
    expect(mockToggle).toHaveBeenCalled();
  });

  test("pause button pauses timer", () => {
    mockUseStopwatch.mockReturnValue({
      ...mockUseStopwatch(),
      toggle: mockToggle,
      isRunning: true,
    });

    render(<Stopwatch />);
    const pauseButton = screen.getByText("⏸");
    fireEvent.click(pauseButton);
    expect(mockToggle).toHaveBeenCalled();
  });

  test("reset button resets timer", () => {
    mockUseStopwatch.mockReturnValue({
      ...mockUseStopwatch(),
      reset: mockReset,
      time: 10,
      isRunning: false,
    });

    render(<Stopwatch />);
    const resetButton = screen.getByText("↺");
    fireEvent.click(resetButton);
    expect(mockReset).toHaveBeenCalled();
  });

  test("lap button records lap", () => {
    mockUseStopwatch.mockReturnValue({
      ...mockUseStopwatch(),
      lap: mockLap,
      isRunning: true,
      time: 5,
    });

    render(<Stopwatch />);
    const lapButton = screen.getByText("LAP");
    fireEvent.click(lapButton);
    expect(mockLap).toHaveBeenCalled();
  });

  test("displays laps", () => {
    mockUseStopwatch.mockReturnValue({
      ...mockUseStopwatch(),
      laps: [5, 10, 15],
      time: 20,
      isRunning: false,
      formatTimeDetailed: jest.fn().mockReturnValue("00:05.0"),
    });

    render(<Stopwatch />);
    expect(screen.getByText("Laps (3)")).toBeInTheDocument();
    expect(screen.getByText("Lap 1")).toBeInTheDocument();
    expect(screen.getByText("Lap 2")).toBeInTheDocument();
    expect(screen.getByText("Lap 3")).toBeInTheDocument();
  });

  test("shows running status", () => {
    mockUseStopwatch.mockReturnValue({
      ...mockUseStopwatch(),
      isRunning: true,
    });

    render(<Stopwatch />);
    expect(screen.getByText("● Running")).toBeInTheDocument();
  });

  test("shows paused status", () => {
    mockUseStopwatch.mockReturnValue({
      ...mockUseStopwatch(),
      isPaused: true,
    });

    render(<Stopwatch />);
    expect(screen.getByText("⏸ Paused")).toBeInTheDocument();
  });

  test("shows time up status", () => {
    mockUseStopwatch.mockReturnValue({
      ...mockUseStopwatch(),
      isComplete: true,
      time: 30,
    });

    render(<Stopwatch />);
    expect(screen.getByText("⏰ Time's up!")).toBeInTheDocument();
  });

  test("shows target time", () => {
    mockUseStopwatch.mockReturnValue({
      ...mockUseStopwatch(),
      targetTime: 60,
      formatTime: jest.fn().mockImplementation((t) => {
        if (t === 60) return "01:00";
        return "00:00";
      }),
    });

    render(<Stopwatch />);
    expect(screen.getByText("Target: 01:00")).toBeInTheDocument();
  });
});
