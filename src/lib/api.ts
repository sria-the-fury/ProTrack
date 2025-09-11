import type { Project } from "./types";

const API_BASE_URL = "/api/projects";

function handleDateConversion(projectData: any): Project {
  const project = { ...projectData, dueDate: new Date(projectData.dueDate) };
  if (projectData.createdAt) {
    project.createdAt = new Date(projectData.createdAt);
  }
  if (projectData.updatedAt) {
    project.updatedAt = new Date(projectData.updatedAt);
  }
  return project;
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
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Failed to add project" }));
    const message = errorData.error?.[0]?.message || "Failed to add project";
    throw new Error(message);
  }
  const data = await res.json();
  return handleDateConversion(data);
}

export async function updateProject(project: Project): Promise<Project> {
  if (!project.id) throw new Error("Project ID is required for update.");
  const res = await fetch(`${API_BASE_URL}/${project.id}`, {
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
