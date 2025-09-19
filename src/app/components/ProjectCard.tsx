'use client';

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar, Edit, Trash2 } from "lucide-react";

interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
    const [timeAgo, setTimeAgo] = useState("");

    useEffect(() => {
        if (project.createdAt) {
            setTimeAgo(formatDistanceToNow(new Date(project.createdAt), { addSuffix: true }));
        }
    }, [project.createdAt]);

    const dueDate = project.dueDate ? new Date(project.dueDate) : new Date();
    const isOverdue = project.status !== 'Completed' && new Date() > dueDate;

    return (
        <Card className="flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="font-headline text-xl">{project.name}</CardTitle>
                    <Badge
                        variant={
                            project.status === 'Completed' ? 'secondary' :
                                project.status === 'In Progress' ? 'default' :
                                    'outline'
                        }
                        className="whitespace-nowrap"
                    >
                        {project.status}
                    </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 text-sm pt-1">
                    <Calendar className="h-4 w-4" />
                    <span className={cn(isOverdue && "text-destructive font-semibold")}>
            Due: {format(dueDate, "MMMM d, yyyy")}
          </span>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{project.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {timeAgo ? `Created ${timeAgo}` : <span style={{ minHeight: '1rem' }} />}
        </span>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(project)} aria-label="Edit project">
                        <Edit className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(project)} aria-label="Delete project" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
