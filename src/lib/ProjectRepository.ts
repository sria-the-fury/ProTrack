
import { db } from "@/lib/firebase";
import { projectSchema } from "@/lib/types";
import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { z } from "zod";

const projectsCollection = collection(db, "projects");

export const projectRepository = {
    async getAll() {
        const q = query(projectsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async create(projectData: z.infer<typeof projectSchema>) {
        const validatedData = projectSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(projectData);

        const newProject = {
            ...validatedData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(projectsCollection, newProject);
        return { id: docRef.id, ...newProject };
    },

    async getById(id: string) {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    },

    async update(id: string, updates: Partial<z.infer<typeof projectSchema>>) {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
        const updatedDoc = await getDoc(docRef);
        return { id: updatedDoc.id, ...updatedDoc.data() };
    },

    async delete(id: string) {
        const docRef = doc(db, "projects", id);
        await deleteDoc(docRef);
    },
};
