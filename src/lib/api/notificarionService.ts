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
}

const notificationService = new NotificationService()
export default notificationService