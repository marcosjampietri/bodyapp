import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/app/db/connect";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Helper to get userId from JWT cookie
async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return (payload.userId as string) || null;
  } catch {
    return null;
  }
}

// GET /api/workouts - Get user's workout history
export async function GET(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const { db } = await connectToDatabase();
    const collection = db.collection("workouts");

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
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const workout = await request.json();
    const { db } = await connectToDatabase();
    const collection = db.collection("workouts");

    // Add metadata
    workout.userId = userId;
    workout.syncedAt = new Date();

    // Check if workout already exists for THIS user (update vs insert)
    const existing = await collection.findOne({ id: workout.id, userId });

    if (existing) {
      await collection.updateOne({ id: workout.id, userId }, { $set: workout });
    } else {
      await collection.insertOne(workout);
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
