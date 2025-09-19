import { Project } from "./types";

const API_BASE_URL = "/api/projects";

function handleDateConversion(data: any): any {
    if (data && typeof data === 'object') {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (key === 'createdAt' || key === 'updatedAt' || key === 'dueDate') {
                    if (data[key] && typeof data[key] === 'string') {
                        data[key] = new Date(data[key]);
                    } else if (data[key] && typeof data[key] === 'object' && data[key].seconds !== undefined) {
                        // Handle Firestore Timestamp
                        data[key] = new Date(data[key].seconds * 1000);
                    }
                }
            }
        }
    }
    return data;
}

export async function fetchProjects(): Promise<Project[]> {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    return data.map(handleDateConversion);
}

export async function addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error("Failed to add project");
    const data = await res.json();
    return handleDateConversion(data);
}

export async function updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to update project" }));
        const message = errorData.error?.[0]?.message || "Failed to update project";
        throw new Error(message);
    }
    const data = await res.json();
    return handleDateConversion(data);
}

export async function deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete project");
}
