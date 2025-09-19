import { NextResponse } from "next/server";
import { projectSchema } from "@/lib/types";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

export const dynamic = 'force-dynamic';

// GET all projects
export async function GET() {
    try {
        const projectsCollection = collection(db, "projects");
        const q = query(projectsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
        const validatedData = projectSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(json);

        const newProject = {
            ...validatedData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const projectsCollection = collection(db, "projects");
        const docRef = await addDoc(projectsCollection, newProject);

        return NextResponse.json({ id: docRef.id, ...newProject }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error creating project: ", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}
