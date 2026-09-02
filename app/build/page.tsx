import Link from "next/link";
import { ExerciseResponse } from "../api/exercises/route";
import ExerciseFilters from "./exercisesFilter";
import Pagination from "./pagination";
import ExercisesList from "./exercisesList";
import WorkoutPreview from "./preview";

// This is the main page component (Server Component)
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // Build query string from searchParams
  const queryParams = new URLSearchParams();

  // Add all filter parameters
  const filterFields = [
    "primaryMuscles",
    "equipment",
    "mechanic",
    "force",
    "level",
    "category",
    "search",
  ];
  filterFields.forEach((field) => {
    const value = params[field];
    if (value && typeof value === "string") {
      queryParams.append(field, value);
    }
  });

  // Pagination
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;
  const limit = typeof params.limit === "string" ? parseInt(params.limit) : 20;
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());

  // Fetch exercises with filters
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/exercises?${queryParams.toString()}`,
    { cache: "no-store" }, // Don't cache for real-time filtering
  );

  if (!response.ok) {
    throw new Error("Failed to fetch exercises");
  }

  const { exercises, pagination }: ExerciseResponse = await response.json();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Exercises</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Home
        </Link>
      </div>
      <WorkoutPreview />

      {/* Filters Component */}
      <ExerciseFilters />

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Found {pagination.total} exercises
        {pagination.total > 0 &&
          ` (Page ${pagination.page} of ${pagination.totalPages})`}
      </div>

      {/* Exercises Grid */}
      {exercises.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No exercises found matching your filters.
          </p>
          <p className="text-gray-400">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <ExercisesList exercises={exercises} />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          baseUrl="/database"
          preserveParams={filterFields}
        />
      )}
    </div>
  );
}
