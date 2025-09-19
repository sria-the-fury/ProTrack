'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, PlusCircle } from "lucide-react";
import { useProjects } from "@/context/ProjectContext";
import { ProjectList } from "@/app/components/ProjectList";
import { ProjectForm } from "@/app/components/ProjectForm";
import { DeleteConfirmationDialog } from "@/app/components/DeleteConfirmationDialog";
import { type Project } from "@/lib/types";

type FilterStatus = "Latest" | "Not Started" | "In Progress" | "Completed";

export default function Home() {
    const { projects, isLoading, addProject, updateProject, deleteProject } = useProjects();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [filter, setFilter] = useState<FilterStatus>("Latest");

    const handleAdd = () => {
        setSelectedProject(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
        setIsDialogOpen(true);
    };

    const handleDelete = (project: Project) => {
        setSelectedProject(project);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedProject?.id) {
            deleteProject(selectedProject.id);
        }
        setIsDeleteDialogOpen(false);
        setSelectedProject(null);
    };

    const handleFormSubmit = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (selectedProject?.id) {
            await updateProject(selectedProject.id, data);
        } else {
            await addProject(data);
        }
    };

    const filteredProjects = useMemo(() => {
        let sortedProjects = [...projects];
        if (filter === "Latest") {
            // Sort by creation date, newest first
            sortedProjects.sort((a, b) => {
                const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return timeB - timeA;
            });
        } else {
            // Filter by status for other tabs
            sortedProjects = projects.filter(p => p.status === filter);
        }
        return sortedProjects;
    }, [projects, filter]);

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-headline font-bold">ProTrack</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-4">
                                    Filter: {filter}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuRadioGroup value={filter} onValueChange={(value) => setFilter(value as FilterStatus)}>
                                    <DropdownMenuRadioItem value="Latest">Latest</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Not Started">Not Started</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="In Progress">In Progress</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Completed">Completed</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Button onClick={handleAdd}>
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                </header>

                <ProjectList
                    projects={filteredProjects}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </main>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>{selectedProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                        <DialogDescription>
                            {selectedProject ? "Make changes to your project here." : "Fill in the details for your new project."} Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <ProjectForm
                        project={selectedProject}
                        onSubmit={handleFormSubmit}
                        onFinished={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
