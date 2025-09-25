
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { type Project } from "@/lib/types"

// 1. Create a form-specific schema that includes placeholder values.
const projectFormSchema = z.object({
    name: z.string().min(3, { message: "Project name must be at least 3 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    status: z.enum(["Select Status", "Not Started", "In Progress", "Completed"]),
    dueDate: z.date().optional(),
})
    // 2. Use `.refine` to add validation rules against the placeholder values.
    .refine(data => data.status !== "Select Status", {
        message: "Please select a valid status.",
        path: ["status"],
    })
    .refine(data => data.dueDate !== undefined, {
        message: "A valid due date is required.",
        path: ["dueDate"],
    });


type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
    project?: Project | null;
    onSubmit: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    onFinished: () => void;
}

export function ProjectForm({ project, onSubmit, onFinished }: ProjectFormProps) {
    // 3. The form hook now uses the new schema, which matches the default values.
    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: project ? {
            name: project.name,
            description: project.description,
            status: project.status,
            dueDate: new Date(project.dueDate)
        } : {
            name: "",
            description: "",
            status: "Select Status",
            dueDate: undefined,
        },
    });

    const { isSubmitting } = form.formState;

    const handleFormSubmit = async (data: ProjectFormData) => {
        try {
            // The data has already been validated by the resolver, so it's safe to cast and submit.
            await onSubmit(data as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>);
            onFinished();
        } catch (error) {
            // Error is handled by context, form remains open for correction
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Website Redesign" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="A short description of the project." className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Select Status" disabled>Select Status</SelectItem>
                                        <SelectItem value="Not Started">Not Started</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col pt-2">
                                <FormLabel>Due Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(new Date(field.value), "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onFinished} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {project ? "Save Changes" : "Create Project"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
