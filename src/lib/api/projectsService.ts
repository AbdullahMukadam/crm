import { NOTIFICATIONS_API_ENDPOINTS } from "@/constants/notifications"
import { FetchClient } from "./fetchClient"
import { APIResponse } from "@/types/auth"
import { NotificationsData } from "@/types/notifications"
import { PROJECTS_API_ENDPOINTS } from "@/constants/projects"
import { Project } from "@/types/project"

class ProjectsService {

    async fetchProjects(): Promise<APIResponse<Project[]>> {
        return FetchClient.makeRequest(PROJECTS_API_ENDPOINTS.FETCH_PROJECTS, {
            method: "GET",
        })
    }

}

const projectService = new ProjectsService()
export default projectService