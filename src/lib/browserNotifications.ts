export type NotificationPermissionState = NotificationPermission | "unsupported";

export function isBrowserNotificationSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermissionState {
    if (!isBrowserNotificationSupported()) {
        return "unsupported";
    }
    return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
    if (!isBrowserNotificationSupported()) {
        return "unsupported";
    }
    return Notification.requestPermission();
}

export function showSystemNotification(title: string, options?: NotificationOptions): void {
    if (!isBrowserNotificationSupported()) {
        return;
    }
    if (Notification.permission !== "granted") {
        return;
    }
    try {
        new Notification(title, options);
    } catch {
        // Some environments (e.g. older Safari) throw on construction; ignore.
    }
}