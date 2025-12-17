import { NOTIFICATIONS_API_ENDPOINTS } from "@/constants/notifications"
import { FetchClient } from "./fetchClient"
import { APIResponse } from "@/types/auth"
import { NotificationsData } from "@/types/notifications"
import { PROJECTS_API_ENDPOINTS } from "@/constants/projects"
import { CreateFeedbackRequest, Project, replyFeedbackRequest } from "@/types/project"

class ProjectsService {

    async fetchProjects(): Promise<APIResponse<Project[]>> {
        return FetchClient.makeRequest(PROJECTS_API_ENDPOINTS.FETCH_PROJECTS, {
            method: "GET",
        })
    }

    async updateProject(data: Partial<Project>): Promise<APIResponse<Project>> {
        return FetchClient.makeRequest(PROJECTS_API_ENDPOINTS.UPDATE_PROJECT, {
            method: "PATCH",
            body: JSON.stringify(data)
        })
    }

    async deleteProject(data: { id: string }): Promise<APIResponse> {
        return FetchClient.makeRequest(PROJECTS_API_ENDPOINTS.DELETE_PROJECT, {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    async fetchProject(data: { id: string }): Promise<APIResponse<Project>> {
        return FetchClient.makeRequest(PROJECTS_API_ENDPOINTS.FETCH_PROJECT, {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    async createFeedback(data: Partial<CreateFeedbackRequest>): Promise<APIResponse<Project>> {
        return FetchClient.makeRequest(PROJECTS_API_ENDPOINTS.CREATE_FEEDBACK, {
            method: "PATCH",
            body: JSON.stringify(data)
        })
    }

    async replyFeedback(data: Partial<replyFeedbackRequest>): Promise<APIResponse<Project>> {
        return FetchClient.makeRequest(PROJECTS_API_ENDPOINTS.REPLY_FEEDBACK, {
            method: "PATCH",
            body: JSON.stringify(data)
        })
    }
}

const projectService = new ProjectsService()
export default projectService