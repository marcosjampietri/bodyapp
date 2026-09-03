"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseStopwatchOptions {
  interval?: number; // Update frequency in ms (default: 100)
  autoStart?: boolean; // Start automatically (default: false)
  onUpdate?: (time: number) => void;
  onLap?: (lapTime: number, totalTime: number) => void;
  onComplete?: (time: number) => void;
}

interface UseStopwatchReturn {
  time: number; // Current time in seconds
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  toggle: () => void;
  lap: () => number; // Returns lap time
  laps: number[]; // All lap times
  formatTime: (seconds?: number) => string;
  formatTimeDetailed: (seconds?: number) => string;
  setTime: (seconds: number) => void;
  progress: number; // Progress towards target (0-100)
  targetTime: number | null;
  setTarget: (seconds: number) => void;
}

export function useStopwatch(
  options: UseStopwatchOptions = {},
): UseStopwatchReturn {
  const {
    interval = 100,
    autoStart = false,
    onUpdate,
    onLap,
    onComplete,
  } = options;

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [targetTime, setTargetTime] = useState<number | null>(null);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const lastLapTimeRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  // Format time as MM:SS
  const formatTime = useCallback(
    (seconds?: number) => {
      const totalSecs = seconds ?? time;
      const mins = Math.floor(totalSecs / 60);
      const secs = Math.floor(totalSecs % 60);
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    },
    [time],
  );

  // Format time as HH:MM:SS.m
  const formatTimeDetailed = useCallback(
    (seconds?: number) => {
      const totalSecs = seconds ?? time;
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = Math.floor(totalSecs % 60);
      const tenths = Math.floor((totalSecs % 1) * 10);

      if (hrs > 0) {
        return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${tenths}`;
      }
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${tenths}`;
    },
    [time],
  );

  // Update timer
  const updateTimer = useCallback(() => {
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    const newTime = elapsed + elapsedRef.current;

    setTime(newTime);

    // Check if target reached
    if (targetTime && newTime >= targetTime) {
      setIsRunning(false);
      setIsPaused(false);
      setIsComplete(true);
      isRunningRef.current = false;
      if (onComplete) onComplete(newTime);
      if (onUpdate) onUpdate(newTime);
      return;
    }

    if (onUpdate) onUpdate(newTime);

    // Continue animation
    animationRef.current = requestAnimationFrame(updateTimer);
  }, [targetTime, onUpdate, onComplete]);

  // Start timer
  const start = useCallback(() => {
    if (isRunning || isComplete) return;

    startTimeRef.current = performance.now();
    setIsRunning(true);
    setIsPaused(false);
    isRunningRef.current = true;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(updateTimer);
  }, [isRunning, isComplete, updateTimer]);

  // Pause timer
  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Save elapsed time
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    elapsedRef.current += elapsed;
    setTime(elapsedRef.current);

    setIsPaused(true);
    setIsRunning(false);
    isRunningRef.current = false;
  }, [isRunning, isPaused]);

  // Reset timer
  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setTime(0);
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    setLaps([]);
    setTargetTime(null);
    elapsedRef.current = 0;
    lastLapTimeRef.current = 0;
    isRunningRef.current = false;
  }, []);

  // Toggle start/pause
  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, start, pause]);

  // Record a lap
  const lap = useCallback(() => {
    if (!isRunning && !isPaused) return 0;

    const currentTime = isRunning ? time : elapsedRef.current;
    const lapTime = currentTime - lastLapTimeRef.current;

    if (lapTime > 0) {
      setLaps((prev) => [...prev, lapTime]);
      lastLapTimeRef.current = currentTime;
      if (onLap) onLap(lapTime, currentTime);
      return lapTime;
    }
    return 0;
  }, [isRunning, isPaused, time, onLap]);

  // Set target time (in seconds)
  const setTarget = useCallback((seconds: number) => {
    setTargetTime(seconds);
    setIsComplete(false);
  }, []);

  // Set time manually
  const setTimeManually = useCallback((seconds: number) => {
    setTime(seconds);
    elapsedRef.current = seconds;
  }, []);

  // Calculate progress
  const progress = targetTime ? Math.min((time / targetTime) * 100, 100) : 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Auto-start
  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart, start]);

  return {
    time,
    isRunning,
    isPaused,
    isComplete,
    start,
    pause,
    reset,
    toggle,
    lap,
    laps,
    formatTime,
    formatTimeDetailed,
    setTime: setTimeManually,
    progress,
    targetTime,
    setTarget,
  };
}
