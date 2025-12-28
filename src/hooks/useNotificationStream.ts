// Custom hook for SSE notifications

import { NotificationsData } from "@/types/notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useNotificationStream() {
    const [notificationsData, setNotificationsData] = useState<NotificationsData | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const hasShownToastRef = useRef(false);

    const connectToStream = useCallback(() => {
        // Close existing connection
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        try {
            // Create EventSource connection
            const eventSource = new EventSource('/api/notifications/stream', {
                withCredentials: true
            });

            eventSource.onopen = () => {
                console.log('SSE connection established');
                setIsConnected(true);
                reconnectAttemptsRef.current = 0;
            };

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    // Handle different event types
                    switch (data.type) {
                        case 'initial':
                        case 'update':
                            setNotificationsData(data.payload);
                            break;
                        case 'new_notification':
                            // Add new notification to the list
                            setNotificationsData(prev => {
                                if (!prev) {
                                    return {
                                        notifications: [data.payload],
                                        unreadCount: 1
                                    };
                                }
                                return {
                                    notifications: [data.payload, ...prev.notifications].slice(0, 20),
                                    unreadCount: prev.unreadCount + 1
                                };
                            });
                            
                            // Show toast for new notification (only once per notification)
                            if (!hasShownToastRef.current) {
                                toast.info(data.payload.title, {
                                    description: data.payload.message,
                                    duration: 5000
                                });
                                hasShownToastRef.current = true;
                                setTimeout(() => {
                                    hasShownToastRef.current = false;
                                }, 1000);
                            }
                            break;
                        case 'heartbeat':
                            // Keep-alive signal - connection is healthy
                            console.log('Heartbeat received');
                            break;
                        default:
                            console.log('Unknown event type:', data.type);
                    }
                } catch (error) {
                    console.error('Error parsing SSE data:', error);
                }
            };

            eventSource.onerror = (error) => {
                console.error('SSE connection error:', error);
                setIsConnected(false);
                eventSource.close();

                // Implement exponential backoff for reconnection
                if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
                    console.log(`Reconnecting in ${delay}ms...`);
                    
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttemptsRef.current++;
                        connectToStream();
                    }, delay);
                } else {
                    console.error('Max reconnection attempts reached');
                    toast.error('Unable to connect to notification service');
                }
            };

            eventSourceRef.current = eventSource;
        } catch (error) {
            console.error('Error creating EventSource:', error);
            setIsConnected(false);
        }
    }, []);

    useEffect(() => {
        connectToStream();

        // Reconnect when tab becomes visible
        const handleVisibilityChange = () => {
            if (!document.hidden && !isConnected) {
                connectToStream();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connectToStream, isConnected]);

    return { notificationsData, isConnected, setNotificationsData };
}