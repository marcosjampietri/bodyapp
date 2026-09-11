"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { ThemeToggle } from "../../components/theme/ThemeToggle";
import ExerciseFilters from "./exercisesFilter";
import Pagination from "./pagination";
import ExercisesList from "./exercisesList";
import WorkoutPreview from "./preview";

export default function BuildPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <BuildPageContent />
    </Suspense>
  );
}

function BuildPageContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for exercises and pagination
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  // Build query string from searchParams
  const getQueryString = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Ensure limit and page are set
    if (!params.has("limit")) params.set("limit", "20");
    if (!params.has("page")) params.set("page", "1");
    return params.toString();
  };

  // Fetch exercises when searchParams change
  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const query = getQueryString();
        const res = await fetch(`/api/exercises?${query}`);
        const data = await res.json();
        setExercises(data.exercises || []);
        setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [searchParams]);

  // Update URL when filters change – this is handled by ExerciseFilters component
  // but we need to listen to its changes via searchParams

  return (
    <div className={`min-h-screen ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-md mx-auto w-full px-4 py-6">
        {/* Header */}
        <div
          className={`flex items-center justify-between mb-6 border-b pb-4 ${
            isDark ? "border-orange-900/20" : "border-red-200"
          }`}
        >
          <h1
            className={`text-xl font-black tracking-tight ${
              isDark ? "text-white" : "text-zinc-800"
            }`}
          >
            Exercises
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`text-sm font-medium transition ${
                isDark
                  ? "text-zinc-400 hover:text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Home
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <WorkoutPreview />

        <ExerciseFilters />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            baseUrl={pathname}
            preserveParams={[
              "primaryMuscles",
              "equipment",
              "mechanic",
              "force",
              "level",
              "category",
              "search",
              "limit",
            ]}
          />
        )}

        {/* Results Count */}
        <div
          className={`mb-4 text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
        >
          Found {pagination.total} exercises
          {pagination.total > 0 &&
            ` (Page ${pagination.page} of ${pagination.totalPages})`}
        </div>

        {/* Loading & Empty States */}
        {loading ? (
          <div
            className={`text-center py-12 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
          >
            Loading exercises...
          </div>
        ) : exercises.length === 0 ? (
          <div
            className={`text-center py-12 rounded-lg ${
              isDark ? "bg-zinc-900/50" : "bg-gray-50"
            }`}
          >
            <p className={isDark ? "text-zinc-400" : "text-zinc-500"}>
              No exercises found matching your filters.
            </p>
          </div>
        ) : (
          <ExercisesList exercises={exercises} />
        )}
      </div>
    </div>
  );
}
