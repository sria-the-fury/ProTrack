import { injectable } from "tsyringe";
import { Project } from "./types";
import { fetchProjects, addProject as addProjectApi, updateProject as updateProjectApi, deleteProject as deleteProjectApi } from "./api";

@injectable()
export class ApiService {
    getProjects(): Promise<Project[]> {
        return fetchProjects();
    }

    addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
        return addProjectApi(project);
    }

    updateProject(project: Project): Promise<Project> {
        return updateProjectApi(project);
    }

    deleteProject(id: string): Promise<void> {
        return deleteProjectApi(id);
    }
}
