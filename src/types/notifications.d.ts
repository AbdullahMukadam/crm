
export interface NotificationsData {
    notifications: {
        id: string;
        type: $Enums.NotificationType;
        link: string | null;
        title: string;
        userId: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }[];
    unreadCount: number;
}