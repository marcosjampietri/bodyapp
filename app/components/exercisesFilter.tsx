"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

interface FilterOptions {
  primaryMuscles: string;
  equipment: string;
  mechanic: string;
  force: string;
  level: string;
  category: string;
  limit: string;
  page: string;
  search?: any;
}

interface ExerciseFiltersProps {
  initialFilters?: Partial<FilterOptions>;
}

// Available options for each filter
const FILTER_OPTIONS = {
  primaryMuscles: [
    { value: "", label: "All Muscles" },
    { value: "abdominals", label: "Abdominals" },
    { value: "back", label: "Back" },
    { value: "biceps", label: "Biceps" },
    { value: "calves", label: "Calves" },
    { value: "chest", label: "Chest" },
    { value: "forearms", label: "Forearms" },
    { value: "glutes", label: "Glutes" },
    { value: "hamstrings", label: "Hamstrings" },
    { value: "legs", label: "Legs" },
    { value: "quadriceps", label: "Quadriceps" },
    { value: "shoulders", label: "Shoulders" },
    { value: "traps", label: "Traps" },
    { value: "triceps", label: "Triceps" },
  ],
  equipment: [
    { value: "", label: "All Equipment" },
    { value: "body only", label: "Body Only" },
    { value: "barbell", label: "Barbell" },
    { value: "dumbbell", label: "Dumbbell" },
    { value: "cable", label: "Cable" },
    { value: "machine", label: "Machine" },
    { value: "kettlebell", label: "Kettlebell" },
    { value: "bands", label: "Resistance Bands" },
    { value: "medicine ball", label: "Medicine Ball" },
    { value: "exercise ball", label: "Exercise Ball" },
    { value: "body weight", label: "Body Weight" },
  ],
  mechanic: [
    { value: "", label: "All Mechanics" },
    { value: "compound", label: "Compound" },
    { value: "isolation", label: "Isolation" },
  ],
  force: [
    { value: "", label: "All Forces" },
    { value: "pull", label: "Pull" },
    { value: "push", label: "Push" },
    { value: "static", label: "Static" },
  ],
  level: [
    { value: "", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" },
  ],
  category: [
    { value: "", label: "All Categories" },
    { value: "strength", label: "Strength" },
    { value: "cardio", label: "Cardio" },
    { value: "stretching", label: "Stretching" },
    { value: "plyometrics", label: "Plyometrics" },
    { value: "powerlifting", label: "Powerlifting" },
    { value: "strongman", label: "Strongman" },
  ],
  limit: [
    { value: "10", label: "10 per page" },
    { value: "20", label: "20 per page" },
    { value: "50", label: "50 per page" },
    { value: "100", label: "100 per page" },
  ],
};

export default function ExerciseFilters({
  initialFilters = {},
}: ExerciseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params or defaults
  const [filters, setFilters] = useState<FilterOptions>({
    primaryMuscles:
      searchParams.get("primaryMuscles") || initialFilters.primaryMuscles || "",
    equipment: searchParams.get("equipment") || initialFilters.equipment || "",
    mechanic: searchParams.get("mechanic") || initialFilters.mechanic || "",
    force: searchParams.get("force") || initialFilters.force || "",
    level: searchParams.get("level") || initialFilters.level || "",
    category: searchParams.get("category") || initialFilters.category || "",
    limit: searchParams.get("limit") || initialFilters.limit || "20",
    page: searchParams.get("page") || initialFilters.page || "1",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: "1" })); // Reset to page 1 on filter change
  };

  const handleSearch = (e: React.ChangeEvent) => {
    e.preventDefault();

    // Build query string from filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    console.log("params", params);

    // Navigate to the current page with filters
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    const emptyFilters: FilterOptions = {
      primaryMuscles: "",
      equipment: "",
      mechanic: "",
      force: "",
      level: "",
      category: "",
      limit: "20",
      page: "1",
    };
    setFilters(emptyFilters);
    router.push(pathname);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white p-4 rounded-lg shadow-md mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Muscle Filter */}
        <div>
          <label
            htmlFor="primaryMuscles"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Primary Muscle
          </label>
          <select
            id="primaryMuscles"
            name="primaryMuscles"
            value={filters.primaryMuscles}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FILTER_OPTIONS.primaryMuscles.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment Filter */}
        <div>
          <label
            htmlFor="equipment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Equipment
          </label>
          <select
            id="equipment"
            name="equipment"
            value={filters.equipment}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FILTER_OPTIONS.equipment.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mechanic Filter */}
        <div>
          <label
            htmlFor="mechanic"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mechanic
          </label>
          <select
            id="mechanic"
            name="mechanic"
            value={filters.mechanic}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FILTER_OPTIONS.mechanic.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Force Filter */}
        <div>
          <label
            htmlFor="force"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Force
          </label>
          <select
            id="force"
            name="force"
            value={filters.force}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FILTER_OPTIONS.force.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Level Filter */}
        <div>
          <label
            htmlFor="level"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Level
          </label>
          <select
            id="level"
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FILTER_OPTIONS.level.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FILTER_OPTIONS.category.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Items per page */}
        <div>
          <label
            htmlFor="limit"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Items per page
          </label>
          <select
            id="limit"
            name="limit"
            value={filters.limit}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FILTER_OPTIONS.limit.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input (for text search) */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search by name
          </label>
          <input
            id="search"
            name="search"
            type="text"
            value={filters.search || ""}
            onChange={handleFilterChange}
            placeholder="Search exercises..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleClearFilters}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </form>
  );
}
