// hooks/useFeedbackStream.ts
import { Feedback } from '@/types/project';
import { useEffect, useState } from 'react';


export function useFeedbackStream(projectId: string) {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!projectId) return;

        const eventSource = new EventSource(`/api/feedback/stream?projectId=${projectId}`);

        eventSource.onopen = () => {
            setIsConnected(true);
            console.log('SSE Connected');
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setFeedback(data);
                console.log("feedbackData", data)
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            setIsConnected(false);
            eventSource.close();
        };

        return () => {
            eventSource.close();
            setIsConnected(false);
        };
    }, [projectId]);

    return { feedback, isConnected };
}

// Usage in your component:
// const { feedback, isConnected } = useFeedbackStream(projectId);