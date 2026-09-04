"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../../components/ui/Button";
import { Plus } from "lucide-react";

interface AddExerciseButtonProps {
  hasExercises: boolean;
}

export function AddExerciseButton({ hasExercises }: AddExerciseButtonProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (hasExercises) {
    return (
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={() => router.push("/build")}
        className="flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Exercise
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={() => router.push("/build")}
      >
        Build New Workout
      </Button>
      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onClick={() => router.push("/history")}
      >
        Load from History
      </Button>
    </div>
  );
}
