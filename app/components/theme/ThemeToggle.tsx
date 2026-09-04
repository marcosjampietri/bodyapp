"use client";

import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-10 h-10 rounded-sm flex items-center justify-center transition-all
        ${
          theme === "dark"
            ? "bg-zinc-900 border border-red-900/30 hover:bg-red-950 hover:border-red-700/50"
            : "bg-white border border-red-200 hover:bg-red-50 hover:border-red-300"
        }
      `}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
      ) : (
        <Moon className="w-5 h-5 text-zinc-600" />
      )}
    </button>
  );
}
