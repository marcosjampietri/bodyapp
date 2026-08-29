import { NextResponse } from "next/server";

import { ObjectId, WithId } from "mongodb";
import { connectToDatabase } from "@/app/db/connect";
import { Exercise, ExerciseFilters } from "@/app/db/models/Exercises";

export interface ExerciseResponse {
  exercises: Exercise[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// GET /api/exercises - Get all exercises with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { db } = await connectToDatabase();
    const collection = db.collection<Exercise>("exercises");

    // Build filter object
    const filters: Record<string, any> = {};

    // Add text search
    const searchTerm = searchParams.get("search");
    if (searchTerm) {
      filters.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { primaryMuscles: { $regex: searchTerm, $options: "i" } },
        { secondaryMuscles: { $regex: searchTerm, $options: "i" } },
      ];
    }

    console.log("req", request.url);
    const filterFields: (keyof ExerciseFilters)[] = [
      "force",
      "level",
      "mechanic",
      "equipment",
      "category",
    ];

    filterFields.forEach((field) => {
      const value = searchParams.get(field);
      if (value) {
        filters[field] = value;
      }
    });

    // Handle primary muscle filter (different because it's an array)
    const primaryMuscle = searchParams.get("primaryMuscles");
    if (primaryMuscle) {
      filters.primaryMuscles = primaryMuscle;
    }

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = (page - 1) * limit;

    // Sorting
    const sortField = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;

    console.log("filter before execute", filters);

    // Execute query
    const exercises = await collection
      .find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await collection.countDocuments(filters);

    const response: ExerciseResponse = {
      exercises,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    console.log("pagination", response.pagination);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 },
    );
  }
}

// GET /api/exercises/:id - Get a single exercise by ID
export async function GET_BY_ID(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("exercises");

    let exercise;
    // Try to find by ObjectId first, then by string id field
    if (ObjectId.isValid(params.id)) {
      exercise = await collection.findOne({ _id: new ObjectId(params.id) });
    }
    if (!exercise) {
      exercise = await collection.findOne({ id: params.id });
    }

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ exercise });
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise" },
      { status: 500 },
    );
  }
}

// POST /api/exercises - Create a new exercise
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    const collection = db.collection("exercises");

    // Validate required fields
    const requiredFields = [
      "name",
      "force",
      "level",
      "mechanic",
      "category",
      "id",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const result = await collection.insertOne(body);

    return NextResponse.json(
      {
        message: "Exercise created successfully",
        exerciseId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json(
      { error: "Failed to create exercise" },
      { status: 500 },
    );
  }
}
