import { NextResponse } from "next/server";
import { projectSchema } from "@/lib/types";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

type Params = {
    params: {
        id: string;
    };
};

export const dynamic = 'force-dynamic';

// GET a single project by ID
export async function GET(request: Request, { params }: Params) {
    try {
        const projectDocRef = doc(db, "projects", params.id);
        const docSnap = await getDoc(projectDocRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
        console.error("Error fetching project: ", error);
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}

// PUT (update) a project
export async function PUT(request: Request, { params }: Params) {
    try {
        const projectDocRef = doc(db, "projects", params.id);
        const docSnap = await getDoc(projectDocRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const json = await request.json();
        const validatedData = projectSchema.partial().parse(json);

        const updatedData = {
            ...validatedData,
            updatedAt: serverTimestamp(),
        };

        await updateDoc(projectDocRef, updatedData);

        return NextResponse.json({ id: params.id, ...updatedData });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error updating project: ", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}

// DELETE a project
export async function DELETE(request: Request, { params }: Params) {
    try {
        const projectDocRef = doc(db, "projects", params.id);
        const docSnap = await getDoc(projectDocRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        await deleteDoc(projectDocRef);
        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        console.error("Error deleting project: ", error);
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}
