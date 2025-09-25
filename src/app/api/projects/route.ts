
import { NextResponse } from "next/server";
import { projectSchema } from "@/lib/types";
import { z } from "zod";
import { projectRepository } from "@/lib/ProjectRepository";

export const dynamic = 'force-dynamic';

// GET all projects
export async function GET() {
    try {
        const projects = await projectRepository.getAll();
        return NextResponse.json(projects);
    } catch (error) {
        console.error("Error fetching projects: ", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

// POST a new project
export async function POST(request: Request) {
    try {
        const json = await request.json();
        const newProject = await projectRepository.create(json);
        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error creating project: ", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}
