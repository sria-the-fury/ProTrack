
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Project } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import container from "@/lib/container";
import { ApiService } from "@/lib/apiService";

interface ProjectContextType {
    projects: Project[];
    isLoading: boolean;
    addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateProject: (project: Project) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Helper to ensure all date fields are Date objects
function coerceDates(projectData: any): Project {
    const project = { ...projectData };
    if (project.dueDate && typeof project.dueDate === 'string') {
        project.dueDate = new Date(project.dueDate);
    }
    if (project.createdAt && typeof project.createdAt === 'string') {
        project.createdAt = new Date(project.createdAt);
    }
    if (project.updatedAt && typeof project.updatedAt === 'string') {
        project.updatedAt = new Date(project.updatedAt);
    }
    return project as Project;
}

export function ProjectProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [apiService] = useState(() => container.resolve<ApiService>("ApiService"));

    const loadProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedProjects = await apiService.getProjects();
            setProjects(fetchedProjects);
        } catch (error) {
            toast({ variant: "destructive", title: "Error loading projects", description: (error as Error).message });
        } finally {
            setIsLoading(false);
        }
    }, [toast, apiService]);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const newProject = await apiService.addProject(project);
            setProjects(prev => [newProject, ...prev]);
            toast({ title: "Success", description: "Project added successfully." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error adding project", description: (error as Error).message });
            throw error;
        }
    };

    const updateProject = async (project: Project) => {
        try {
            const updatedProject = await apiService.updateProject(project);
            setProjects(prev => prev.map(p => (p.id === updatedProject.id ? updatedProject : p)));
            toast({ title: "Success", description: "Project updated successfully." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error updating project", description: (error as Error).message });
            throw error;
        }
    };

    const deleteProject = async (id: string) => {
        try {
            await apiService.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
            toast({ title: "Success", description: "Project deleted successfully." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error deleting project", description: (error as Error).message });
        }
    };

    const handleFormSubmit = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>, selectedProject: Project | null) => {
        if (selectedProject?.id) {
            // When updating, we need to preserve the original createdAt date
            const projectToUpdate = {
                ...data,
                id: selectedProject.id,
                createdAt: selectedProject.createdAt,
                // The updatedAt will be set by the server, but we can update it on the client for immediate feedback
                updatedAt: new Date()
            };
            await updateProject(coerceDates(projectToUpdate));
        } else {
            await addProject(data);
        }
    };

    return (
        <ProjectContext.Provider value={{ projects, isLoading, addProject, updateProject, deleteProject }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error("useProjects must be used within a ProjectProvider");
    }
    return context;
}
