"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { Clock, Play, StopCircle } from "lucide-react";

export default function Stopwatch() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isResting) setRestTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRest = () => {
    setRestTime(0);
    setIsResting(true);
  };

  const stopRest = () => {
    setIsResting(false);
  };

  return (
    <div className="mt-6">
      {!isResting ? (
        <button
          onClick={startRest}
          className={`
            w-full py-4 rounded-full font-michroma font-black uppercase tracking-[0.15em] text-sm
            transition-all duration-300
            ${
              isDark
                ? "bg-zinc-900 text-orange-400 border-2 border-orange-600/30 shadow-2xl shadow-orange-600/10 hover:shadow-orange-600/30 hover:border-orange-500/60"
                : "bg-white text-red-600 border-2 border-red-500 shadow-md shadow-red-200/50 hover:shadow-red-300/70"
            }
            flex items-center justify-center gap-4
          `}
        >
          <Clock className="w-5 h-5" />
          REST
        </button>
      ) : (
        <div className="w-full flex flex-col items-center gap-4">
          <div
            className={`
            w-full px-6 py-5 rounded-xl text-center
            ${
              isDark
                ? "bg-linear-to-br from-orange-950/30 to-amber-950/30 border-2 border-orange-500/40 shadow-2xl shadow-orange-600/20"
                : "bg-red-50 border-2 border-red-300 shadow-md shadow-red-200/50"
            }
          `}
          >
            <span
              className={`
              text-5xl font-black tracking-wider tabular-nums
              font-michroma
              ${
                isDark
                  ? "text-orange-300 drop-shadow-[0_0_40px_rgba(251,146,60,0.3)]"
                  : "text-red-700"
              }
            `}
            >
              {formatTime(restTime)}
            </span>
          </div>

          <button
            onClick={stopRest}
            className={`
              w-full py-3 rounded-full text-sm font-black uppercase tracking-wider transition flex items-center justify-center gap-3
              ${
                isDark
                  ? "bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-700/40 border border-red-600/50"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-200"
              }
            `}
          >
            <StopCircle className="w-5 h-5" />
            Stop Rest
          </button>
        </div>
      )}
    </div>
  );
}
