import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/db/connect";
import bcrypt from "bcryptjs";
import type { User } from "@/app/db/models/Users";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { db } = await connectToDatabase();
    const users = db.collection<User>("users");

    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "User created",
        user: { _id: result.insertedId.toString(), email: normalizedEmail },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 },
    );
  }
}
