'use client';

import "@/lib/container";
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { container } from "tsyringe";
import { Project } from "@/lib/types";
import { ApiService } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";

// Helper to ensure all date fields are Date objects
function coerceDates(projectData: any): Project {
    const project = { ...projectData };
    const toDate = (field: any): Date | undefined => {
        if (!field) return undefined;
        if (field instanceof Date) return field;
        if (typeof field === 'string') return new Date(field);
        // Handle Firestore Timestamp object
        if (typeof field === 'object' && field.seconds !== undefined && field.nanoseconds !== undefined) {
            return new Date(field.seconds * 1000);
        }
        // If we don't recognize the format, return undefined to prevent crashes
        return undefined;
    };

    project.dueDate = toDate(project.dueDate);
    project.createdAt = toDate(project.createdAt);
    project.updatedAt = toDate(project.updatedAt);

    return project as Project;
}

export const ProjectContext = createContext<{
    projects: Project[];
    isLoading: boolean;
    addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    updateProject: (id: string, project: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
}>({
    projects: [],
    isLoading: true,
    addProject: async (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {},
    updateProject: async (id: string, project: Partial<Project>) => {},
    deleteProject: async (id: string) => {}
});

export function ProjectProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [apiService] = useState(() => container.resolve<ApiService>("ApiService"));

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const fetchedProjects = await apiService.getProjects();
                setProjects(fetchedProjects.map(coerceDates));
            } catch (error) {
                toast({ title: "Error fetching projects", description: "Could not fetch projects. Please try again later.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, [apiService, toast]);

    const addProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
        try {
            const newProject = await apiService.addProject(project);
            setProjects(prev => [coerceDates(newProject), ...prev]);
            toast({ title: "Project added", description: "The new project has been added successfully." });
        } catch (error) {
            toast({ title: "Error adding project", description: "Could not add the project. Please try again.", variant: "destructive" });
            throw error;
        }
    };

    const updateProject = async (id: string, project: Partial<Project>) => {
        try {
            const updatedProject = await apiService.updateProject(id, project);
            setProjects(prev => prev.map(p => (p.id === id ? coerceDates(updatedProject) : p)));
            toast({ title: "Project updated", description: "The project has been updated successfully." });
        } catch (error) {
            toast({ title: "Error updating project", description: "Could not update the project. Please try again.", variant: "destructive" });
            throw error;
        }
    };

    const deleteProject = async (id: string) => {
        try {
            await apiService.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
            toast({ title: "Project deleted", description: "The project has been deleted successfully." });
        } catch (error) {
            toast({ title: "Error deleting project", description: "Could not delete the project. Please try again.", variant: "destructive" });
            throw error;
        }
    };

    return <ProjectContext.Provider value={{ projects, isLoading, addProject, updateProject, deleteProject }}>{children}</ProjectContext.Provider>;
}

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error("useProjects must be used within a ProjectProvider");
    }
    return context;
};