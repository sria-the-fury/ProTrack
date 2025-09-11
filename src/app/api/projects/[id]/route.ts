import { NextResponse } from "next/server";
import { projects } from "@/lib/data";
import { projectSchema } from "@/lib/types";
import { z } from "zod";

type Params = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

// GET a single project by ID
export async function GET(request: Request, { params }: Params) {
  const project = projects.find(p => p.id === params.id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

// PUT (update) a project
export async function PUT(request: Request, { params }: Params) {
  const projectIndex = projects.findIndex(p => p.id === params.id);
  if (projectIndex === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  try {
    const json = await request.json();
    const validatedData = projectSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(json);

    const updatedProject = {
      ...projects[projectIndex],
      ...validatedData,
      updatedAt: new Date(),
    };

    projects[projectIndex] = updatedProject;
    return NextResponse.json(updatedProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

// DELETE a project
export async function DELETE(request: Request, { params }: Params) {
  const projectIndex = projects.findIndex(p => p.id === params.id);
  if (projectIndex === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  projects.splice(projectIndex, 1);
  return new NextResponse(null, { status: 204 }); // No Content
}
