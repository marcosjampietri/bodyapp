"use client";

import { useTheme } from "../../context/ThemeContext";
import { Flame, Target } from "lucide-react";
import { Card } from "../../components/ui/Card";

interface WorkoutStatsProps {
  streak: number;
  volume: string;
}

export function WorkoutStats({ streak, volume }: WorkoutStatsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: streak.toString(),
      sub: "Days of war",
    },
    {
      icon: Target,
      label: "Volume",
      value: volume,
      sub: "Total kg",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {stats.map((stat, i) => (
        <Card key={i} variant="stats">
          <div className="flex items-center gap-2 mb-1">
            <stat.icon
              className={`w-4 h-4 ${
                isDark
                  ? "text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.4)]"
                  : "text-red-500"
              }`}
            />
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
          <p
            className={`text-2xl font-black ${
              isDark
                ? "text-red-500 drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                : "text-red-600"
            }`}
          >
            {stat.value}
          </p>
          <p className="text-[10px] text-zinc-600 uppercase">{stat.sub}</p>
        </Card>
      ))}
    </div>
  );
}
