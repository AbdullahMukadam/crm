import { NOTIFICATIONS_API_ENDPOINTS } from "@/constants/notifications"
import { FetchClient } from "./fetchClient"
import { APIResponse } from "@/types/auth"
import { NotificationsData } from "@/types/notifications"

class NotificationService {

    async fetchNotifications(): Promise<APIResponse<NotificationsData>> {
        return FetchClient.makeRequest(NOTIFICATIONS_API_ENDPOINTS.FETCH_NOTIFICATIONS, {
            method: "GET",
        })
    }

    async markasRead(notificationId : string): Promise<APIResponse> {
        return FetchClient.makeRequest(NOTIFICATIONS_API_ENDPOINTS.MARK_AS_READ, {
            method: "POST",
            body : JSON.stringify(notificationId)
        })
    }
}

const notificationService = new NotificationService()
export default notificationService