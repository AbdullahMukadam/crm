import { useCallback, useState } from "react";
import {
    getNotificationPermission,
    requestNotificationPermission,
} from "@/lib/browserNotifications";

export function useBrowserNotifications() {
    const [permission, setPermission] = useState(getNotificationPermission);

    const requestPermission = useCallback(async () => {
        const result = await requestNotificationPermission();
        setPermission(result);
        return result;
    }, []);

    return {
        permission,
        requestPermission,
        isSupported: permission !== "unsupported",
        enabled: permission === "granted",
    };
}