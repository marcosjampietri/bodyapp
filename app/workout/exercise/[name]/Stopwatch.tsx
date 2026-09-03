"use client";

import { useStopwatch } from "./useStopwatch";

const PRESET_TIMES = [
  { label: "30s", value: 30 },
  { label: "1min", value: 60 },
  { label: "90s", value: 90 },
  { label: "2min", value: 120 },
  { label: "3min", value: 180 },
  { label: "5min", value: 300 },
];

interface StopwatchProps {
  className?: string;
  onTimeUpdate?: (seconds: number) => void;
  onLapRecord?: (lapTime: number, totalTime: number) => void;
  onComplete?: (seconds: number) => void;
}

export default function Stopwatch({
  className = "",
  onTimeUpdate,
  onLapRecord,
  onComplete,
}: StopwatchProps) {
  const {
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
    progress,
    targetTime,
    setTarget,
  } = useStopwatch({
    onUpdate: onTimeUpdate,
    onLap: onLapRecord,
    onComplete,
  });

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {PRESET_TIMES.map((preset) => (
          <button
            key={preset.value}
            onClick={() => {
              reset();
              setTarget(preset.value);
              start();
            }}
            className={`px-3 py-1 text-xs rounded-full transition ${
              targetTime === preset.value
                ? "bg-cyan-500 text-black font-bold"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => {
            reset();
            setTarget(0);
          }}
          className="px-3 py-1 text-xs rounded-full bg-gray-600 text-white hover:bg-gray-500 transition"
        >
          Free
        </button>
      </div>

      {/* Timer Display */}
      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
        {targetTime && targetTime > 0 && (
          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-cyan-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="text-6xl font-mono font-bold text-white tabular-nums">
          {formatTime()}
        </div>

        <div className="mt-1 flex justify-center gap-4 text-sm">
          {isRunning && <span className="text-green-400">● Running</span>}
          {isPaused && <span className="text-yellow-400">⏸ Paused</span>}
          {!isRunning && !isPaused && time === 0 && (
            <span className="text-gray-500">Ready</span>
          )}
          {isComplete && (
            <span className="text-red-400 font-bold animate-pulse">
              ⏰ Time's up!
            </span>
          )}
          {targetTime && targetTime > 0 && (
            <span className="text-gray-400">
              Target: {formatTime(targetTime)}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={toggle}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition ${
            isRunning
              ? "bg-yellow-500 text-black hover:bg-yellow-400"
              : "bg-cyan-500 text-black hover:bg-cyan-400"
          }`}
        >
          {isRunning ? "⏸" : "▶"}
        </button>

        <button
          onClick={lap}
          disabled={!isRunning}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold transition ${
            isRunning
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          LAP
        </button>

        <button
          onClick={reset}
          disabled={time === 0}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-xl transition ${
            time > 0
              ? "bg-red-600 text-white hover:bg-red-500"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          ↺
        </button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="mt-4 max-h-32 overflow-y-auto">
          <div className="text-xs text-gray-400 mb-2">Laps ({laps.length})</div>
          <div className="space-y-1">
            {laps.map((lapTime, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-300 border-b border-gray-700 py-1"
              >
                <span>Lap {index + 1}</span>
                <span className="font-mono">{formatTimeDetailed(lapTime)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
