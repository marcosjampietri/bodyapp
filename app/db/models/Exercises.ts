import { ObjectId } from "mongodb";

export interface Exercise {
  _id: string;
  name: string;
  force: "pull" | "push" | "static";
  level: "beginner" | "intermediate" | "expert";
  mechanic: "compound" | "isolation";
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
  id: string;
}

export interface ExerciseFilters {
  force?: string;
  level?: string;
  mechanic?: string;
  equipment?: string;
  category?: string;
  primaryMuscle?: string;
}
