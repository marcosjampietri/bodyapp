import { renderHook, act } from "@testing-library/react";
import { useStopwatch } from "../useStopwatch"; // Import from parent folder

describe("useStopwatch", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("initial state is correct", () => {
    const { result } = renderHook(() => useStopwatch());

    expect(result.current.time).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.laps).toEqual([]);
  });

  test("start starts the timer", () => {
    const { result } = renderHook(() => useStopwatch());

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  test("pause pauses the timer", () => {
    const { result } = renderHook(() => useStopwatch());

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.pause();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(true);
  });

  test("reset resets the timer", () => {
    const { result } = renderHook(() => useStopwatch());

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.time).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.laps).toEqual([]);
  });

  test("lap records lap times", () => {
    const { result } = renderHook(() => useStopwatch());

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    let lapTime = 0;
    act(() => {
      lapTime = result.current.lap();
    });

    expect(result.current.laps.length).toBe(1);
    expect(lapTime).toBeGreaterThan(0);
  });

  test("setTarget sets target time", () => {
    const { result } = renderHook(() => useStopwatch());

    act(() => {
      result.current.setTarget(60);
    });

    expect(result.current.targetTime).toBe(60);
  });

  test("onUpdate callback is called", () => {
    const onUpdate = jest.fn();
    const { result } = renderHook(() => useStopwatch({ onUpdate }));

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onUpdate).toHaveBeenCalled();
  });

  test("formatTime formats correctly", () => {
    const { result } = renderHook(() => useStopwatch());

    expect(result.current.formatTime(65)).toBe("01:05");
    expect(result.current.formatTime(125)).toBe("02:05");
    expect(result.current.formatTime(5)).toBe("00:05");
  });

  test("formatTimeDetailed formats with decimals", () => {
    const { result } = renderHook(() => useStopwatch());

    expect(result.current.formatTimeDetailed(65.5)).toBe("01:05.5");
    expect(result.current.formatTimeDetailed(125.25)).toBe("02:05.2");
  });
});
