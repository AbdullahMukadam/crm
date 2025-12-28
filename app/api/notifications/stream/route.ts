import { verifyUser } from "@/lib/middleware/verify-user";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { connectionManager } from "@/lib/notification-connection-manager";

export async function GET(request: NextRequest) {
    const { user, error } = await verifyUser(request);

    if (!user || error) {
        return new Response(
            JSON.stringify({ success: false, message: "Unauthorized User" }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const userId = user.id as string;

    // Create SSE stream
    const encoder = new TextEncoder();
    let controller: ReadableStreamDefaultController;
    let heartbeatInterval: NodeJS.Timeout;

    const stream = new ReadableStream({
        async start(ctrl) {
            controller = ctrl;

            try {
                // Fetch initial notifications
                const notifications = await prisma.notification.findMany({
                    where: { userId: userId },
                    orderBy: { createdAt: 'desc' },
                    take: 20
                });

                const unreadCount = await prisma.notification.count({
                    where: { userId: userId, isRead: false }
                });

                // Send initial data
                const initialData = {
                    type: 'initial',
                    payload: {
                        notifications,
                        unreadCount
                    }
                };

                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`)
                );

                // Add connection to manager
                connectionManager.addConnection(userId, controller);

                // Send heartbeat every 30 seconds to keep connection alive
                heartbeatInterval = setInterval(() => {
                    try {
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`)
                        );
                    } catch (error) {
                        console.error('Heartbeat error:', error);
                        clearInterval(heartbeatInterval);
                    }
                }, 30000);

            } catch (error) {
                console.error('Error initializing SSE stream:', error);
                controller.error(error);
            }
        },

        cancel() {
            // Cleanup when connection closes
            console.log(`SSE connection closed for user: ${userId}`);
            clearInterval(heartbeatInterval);
            connectionManager.removeConnection(userId, controller);
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Disable nginx buffering
        }
    });
}