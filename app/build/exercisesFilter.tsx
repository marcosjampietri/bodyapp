"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/ui/Button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FilterOptions {
  primaryMuscles: string;
  equipment: string;
  mechanic: string;
  force: string;
  category: string;
  limit: string;
  page: string;
  // level: string;
  search?: string;
}

interface ExerciseFiltersProps {
  initialFilters?: Partial<FilterOptions>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Category tabs (key + display label)
const FILTER_CATEGORIES = [
  { key: "primaryMuscles", label: "Muscle" },
  { key: "equipment", label: "Equipment" },
  { key: "mechanic", label: "Mechanic" },
  { key: "force", label: "Force" },
  // { key: "level", label: "Level" },
  { key: "category", label: "Category" },
] as const;

// Options for each category
const FILTER_OPTIONS: Record<string, { value: string; label: string }[]> = {
  primaryMuscles: [
    { value: "", label: "All" },
    { value: "chest", label: "Chest" },
    { value: "lats", label: "Lats" },
    { value: "lower back", label: "Lower Back" },
    { value: "middle back", label: "Middle Back" },
    { value: "shoulders", label: "Shoulders" },
    { value: "biceps", label: "Biceps" },
    { value: "triceps", label: "Triceps" },
    { value: "forearms", label: "Forearms" },
    { value: "traps", label: "Traps" },
    { value: "quadriceps", label: "Quadriceps" },
    { value: "hamstrings", label: "Hamstrings" },
    { value: "abductors", label: "Abductors" },
    { value: "adductors", label: "Adductors" },
    { value: "glutes", label: "Glutes" },
    { value: "calves", label: "Calves" },
    { value: "abdominals", label: "Abdominals" },
  ],
  equipment: [
    { value: "", label: "All" },
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
    { value: "", label: "All" },
    { value: "compound", label: "Compound" },
    { value: "isolation", label: "Isolation" },
  ],
  force: [
    { value: "", label: "All" },
    { value: "pull", label: "Pull" },
    { value: "push", label: "Push" },
    { value: "static", label: "Static" },
  ],
  // level: [
  //   { value: "", label: "All" },
  //   { value: "beginner", label: "Beginner" },
  //   { value: "intermediate", label: "Intermediate" },
  //   { value: "expert", label: "Expert" },
  // ],
  category: [
    { value: "", label: "All" },
    { value: "strength", label: "Strength" },
    { value: "cardio", label: "Cardio" },
    { value: "stretching", label: "Stretching" },
    { value: "plyometrics", label: "Plyometrics" },
    { value: "powerlifting", label: "Powerlifting" },
    { value: "strongman", label: "Strongman" },
  ],
};

// Separate from the filters (not a tab)
const LIMIT_OPTIONS = [
  { value: "10", label: "10 per page" },
  { value: "20", label: "20 per page" },
  { value: "50", label: "50 per page" },
  { value: "100", label: "100 per page" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ExerciseFilters({
  initialFilters = {},
}: ExerciseFiltersProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);

  const [filters, setFilters] = useState<FilterOptions>({
    primaryMuscles:
      searchParams.get("primaryMuscles") || initialFilters.primaryMuscles || "",
    equipment: searchParams.get("equipment") || initialFilters.equipment || "",
    mechanic: searchParams.get("mechanic") || initialFilters.mechanic || "",
    force: searchParams.get("force") || initialFilters.force || "",
    // level: searchParams.get("level") || initialFilters.level || "",
    category: searchParams.get("category") || initialFilters.category || "",
    limit: searchParams.get("limit") || initialFilters.limit || "20",
    page: searchParams.get("page") || initialFilters.page || "1",
  });

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const handleFilterChange = (e: any) => {
    const { name, value } = e;
    setFilters((prev) => ({ ...prev, [name]: value, page: "1" }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    handleSearch();
  }, [filters]);

  const handleClearFilters = () => {
    const emptyFilters: FilterOptions = {
      primaryMuscles: "",
      equipment: "",
      mechanic: "",
      force: "",
      // level: "",
      category: "",
      limit: "20",
      page: "1",
    };
    setFilters(emptyFilters);
    router.push(pathname);
  };

  // -------------------------------------------------------------------------
  // Derived values
  // -------------------------------------------------------------------------

  const currentCategory = FILTER_CATEGORIES[currentFilterIndex];
  const currentOptions = FILTER_OPTIONS[currentCategory.key];
  const currentValue = filters[currentCategory.key as keyof FilterOptions];

  // -------------------------------------------------------------------------
  // Styles
  // -------------------------------------------------------------------------

  const containerClass = `p-4 rounded-sm border mb-6 ${
    isDark ? "bg-zinc-900/50 border-orange-900/20" : "bg-white border-red-200"
  }`;

  // --- Tabs ---
  const getTabClass = (isActive: boolean, hasValue: boolean) => {
    if (isDark) {
      if (isActive)
        return "bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-600/40";
      if (hasValue)
        return "bg-orange-950/40 text-orange-400 border-orange-700/50 hover:border-orange-600";
      return "bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-600";
    }
    if (isActive)
      return "bg-red-600 text-white border-red-600 shadow-md shadow-red-300";
    if (hasValue)
      return "bg-red-50 text-red-600 border-red-300 hover:border-red-400";
    return "bg-gray-100 text-gray-500 border-gray-200 hover:border-gray-300";
  };

  // --- Options (smaller, softer) ---
  const getOptionClass = (isActive: boolean) => {
    if (isDark) {
      return isActive
        ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
        : "bg-zinc-800/40 text-zinc-400 border-zinc-800 hover:border-zinc-700";
    }
    return isActive
      ? "bg-red-50 text-red-700 border-red-300"
      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300";
  };

  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-1 ${
    isDark ? "text-zinc-400" : "text-zinc-500"
  }`;

  const inputClass = `w-full px-3 py-2 text-sm rounded-sm border focus:outline-none focus:ring-2 ${
    isDark
      ? "bg-zinc-800 text-white border-zinc-700 focus:border-orange-500 focus:ring-orange-500/20"
      : "bg-gray-50 text-zinc-800 border-gray-200 focus:border-red-400 focus:ring-red-200"
  }`;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <>
      <div className={containerClass}>
        {/* Category tabs */}
        <div className="flex mb-4">
          <div className="flex flex-col w-1/3 gap-1.5">
            {FILTER_CATEGORIES.map((cat, index) => {
              const isActive = index === currentFilterIndex;
              const hasValue = !!filters[cat.key as keyof FilterOptions];
              return (
                <Button
                  key={cat.key}
                  onClick={() => setCurrentFilterIndex(index)}
                  className={`px-3 py-2 rounded-sm text-[11px] font-black uppercase tracking-wider border transition-all ${getTabClass(
                    isActive,
                    hasValue,
                  )}`}
                >
                  {cat.label}
                  {hasValue && !isActive && (
                    <span className="ml-1.5 text-[9px] opacity-70">●</span>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Options for the selected category */}
          <div className="flex flex-wrap h-[196.5px] w-2/3 ml-4 gap-1.5 overflow-y-scroll p-2">
            {currentOptions.map(({ label, value }) => {
              const isActive = value === currentValue;
              return (
                <button
                  key={label}
                  onClick={() =>
                    handleFilterChange({ name: currentCategory.key, value })
                  }
                  className={`px-2.5 py-1 h-12 rounded-sm text-[10px] font-bold uppercase tracking-wide border transition-all ${getOptionClass(
                    isActive,
                  )}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Search */}

        <div>
          <label htmlFor="search" className={labelClass}>
            Search
          </label>
          <input
            id="search"
            name="search"
            type="text"
            value={filters.search || ""}
            onChange={(e) =>
              handleFilterChange({ name: e.target.name, value: e.target.value })
            }
            placeholder="Search exercises..."
            className={inputClass}
          />
        </div>

        {/* Clear */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleClearFilters}
            className={`px-6 py-2 rounded-sm text-sm font-black uppercase tracking-wider transition ${
              isDark
                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                : "bg-gray-200 hover:bg-gray-300 text-zinc-600"
            }`}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="w-20 justify-end">
        <label htmlFor="limit" className={labelClass}>
          Per page
        </label>
        <select
          id="limit"
          name="limit"
          value={filters.limit}
          onChange={(e) =>
            handleFilterChange({ name: e.target.name, value: e.target.value })
          }
          className={inputClass}
        >
          {LIMIT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
