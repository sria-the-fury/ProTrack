import { NextResponse } from "next/server";
import { projects } from "@/lib/data";
import { projectSchema } from "@/lib/types";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const dynamic = 'force-dynamic';

// GET all projects
export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Default sort by latest created
  const sortedProjects = [...projects].sort((a, b) => {
    const timeA = a.createdAt ? a.createdAt.getTime() : 0;
    const timeB = b.createdAt ? b.createdAt.getTime() : 0;
    return timeB - timeA; // Newest first
  });
  return NextResponse.json(sortedProjects);
}

// POST a new project
export async function POST(request: Request) {
  try {
    const json = await request.json();
    
    // Server generates the ID, so we validate the rest of the data.
    const validatedData = projectSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(json);

    const now = new Date();
    const newProject = {
      id: uuidv4(),
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    };

    projects.unshift(newProject); // Add to the beginning of the array
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
