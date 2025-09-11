import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3, { message: "Project name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
  dueDate: z.coerce.date({
    errorMap: () => ({ message: "A valid due date is required." }),
  }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
});

export type Project = z.infer<typeof projectSchema>;
