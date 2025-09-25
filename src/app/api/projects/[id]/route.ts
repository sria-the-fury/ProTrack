
import { NextRequest, NextResponse } from "next/server";
import { projectSchema } from "@/lib/types";
import { z } from "zod";
import { projectRepository } from "@/lib/ProjectRepository";

export const dynamic = 'force-dynamic';

// Helper to get ID from URL
const getIdFromRequest = (request: NextRequest) => {
    // The URL is structured as /api/projects/[id]
    const segments = request.nextUrl.pathname.split('/');
    // The last segment will be the id
    return segments.pop() || '';
};

// GET a single project by ID
export async function GET(request: NextRequest) {
    const id = getIdFromRequest(request);
    try {
        const project = await projectRepository.getById(id);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error(`Error fetching project ${id}: `, error);
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}

// PUT (update) a project
export async function PUT(request: NextRequest) {
    const id = getIdFromRequest(request);
    try {
        const json = await request.json();
        const validatedData = projectSchema.partial().parse(json);

        const updatedProject = await projectRepository.update(id, validatedData);

        if (!updatedProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProject);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error(`Error updating project ${id}: `, error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}

// DELETE a project
export async function DELETE(request: NextRequest) {
    const id = getIdFromRequest(request);
    try {
        // First, check if the project exists to provide a clear error message
        const project = await projectRepository.getById(id);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        await projectRepository.delete(id);
        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        console.error(`Error deleting project ${id}: `, error);
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}
