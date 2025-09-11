import type { Project } from "./types";
import { v4 as uuidv4 } from "uuid";

// This is our in-memory "database".
// In a real application, this would be a real database.
export let projects: Project[] = [
  {
    id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    name: "Corporate Website Redesign",
    description: "Complete overhaul of the main corporate website to improve user experience and modernize the design.",
    status: "In Progress",
    dueDate: new Date("2024-12-15T00:00:00.000Z"),
    createdAt: new Date("2024-05-01T10:00:00.000Z"),
    updatedAt: new Date("2024-05-15T14:30:00.000Z"),
  },
  {
    id: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    name: "Mobile App Development",
    description: "Develop a new cross-platform mobile application for customer engagement.",
    status: "Not Started",
    dueDate: new Date("2025-03-01T00:00:00.000Z"),
    createdAt: new Date("2024-06-10T09:00:00.000Z"),
    updatedAt: new Date("2024-06-10T09:00:00.000Z"),
  },
  {
    id: "9a7d9b4c-9b8d-4a6f-9a7d-9b4c9a7d9b4c",
    name: "API Security Audit",
    description: "Perform a comprehensive security audit of all public-facing APIs to identify and patch vulnerabilities.",
    status: "Completed",
    dueDate: new Date("2024-06-30T00:00:00.000Z"),
    createdAt: new Date("2024-04-20T11:00:00.000Z"),
    updatedAt: new Date("2024-06-25T16:00:00.000Z"),
  },
];
