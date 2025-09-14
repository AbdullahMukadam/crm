
export type ProjectStatus = "planning" | "in-progress" | "completed" | "cancelled";

export interface Project {
    id: string;
    title: string;
    description: string;
    status: ProjectStatus;
    budget: number;
    deadline: Date;
    clientId: string;
    creatorId: string;
}