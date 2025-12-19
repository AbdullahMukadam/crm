
import { useEffect, useRef, useState } from 'react';
import { pusherClient } from '@/lib/pusher/client';
import { Feedback } from '@/types/project';
import { Channel } from 'pusher-js';

interface UseFeedbackStreamOptions {
  projectId: string;
  onFeedbackCreated?: (feedback: Feedback) => void;
  onReplyCreated?: (reply: Feedback & { parentId: string }) => void;
}

export function useFeedbackStream({ 
  projectId, 
  onFeedbackCreated, 
  onReplyCreated 
}: UseFeedbackStreamOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<Channel | null>(null);


  useEffect(() => {
    if (!projectId) return;

    // Subscribe to project channel
    const channelName = `project-${projectId}`;
    const projectChannel = pusherClient.subscribe(channelName);

    projectChannel.bind('pusher:subscription_succeeded', () => {
      console.log('Pusher connected to:', channelName);
      setIsConnected(true);
    });

    projectChannel.bind('pusher:subscription_error', (error: any) => {
      console.error('Pusher subscription error:', error);
      setIsConnected(false);
    });

    // Listen for new feedback
    projectChannel.bind('feedback:created', (feedback: Feedback) => {
      console.log('New feedback received:', feedback);
      onFeedbackCreated?.(feedback);
    });

    // Listen for new replies
    projectChannel.bind('reply:created', (reply: Feedback & { parentId: string }) => {
      console.log('New reply received:', reply);
      onReplyCreated?.(reply);
    });

    channelRef.current = projectChannel;

    // Cleanup
    return () => {
      projectChannel.unbind_all();
      pusherClient.unsubscribe(channelName);
      setIsConnected(false);
    };
  }, [projectId, onFeedbackCreated, onReplyCreated]);

  return { isConnected };
}