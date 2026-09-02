import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/app/db/connect";

// GET /api/workouts - Get user's workout history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { db } = await connectToDatabase();
    const collection = db.collection("workouts");

    // Get user ID from session (implement your auth)
    const userId = "user123"; // Replace with actual user ID

    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const workouts = await collection
      .find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments({ userId });

    return NextResponse.json({
      workouts,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 },
    );
  }
}

// POST /api/workouts - Save a completed workout
export async function POST(request: Request) {
  try {
    const workout = await request.json();
    const { db } = await connectToDatabase();
    const collection = db.collection("workouts");

    // Add metadata
    workout.userId = "user123"; // Replace with actual user ID
    workout.syncedAt = new Date();

    // Check if workout already exists (update vs insert)
    const existing = await collection.findOne({ id: workout.id });

    let result;
    if (existing) {
      result = await collection.updateOne(
        { id: workout.id },
        { $set: workout },
      );
    } else {
      result = await collection.insertOne(workout);
    }

    return NextResponse.json({
      success: true,
      workoutId: workout.id,
    });
  } catch (error) {
    console.error("Error saving workout:", error);
    return NextResponse.json(
      { error: "Failed to save workout" },
      { status: 500 },
    );
  }
}
