// app/api/feedback/[feedbackId]/reply/route.ts
import { createNotification } from "@/lib/createNotifications";
import { verifyUser } from "@/lib/middleware/verify-user";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ feedbackId: string }> }
) {
    const { user, error } = await verifyUser(request);
    const body = await request.json();
    const { feedbackId } = await params

    if (error || !user) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { message } = body;

    if (!message?.trim()) {
        return NextResponse.json(
            { success: false, message: "Message is required" },
            { status: 400 }
        );
    }

    try {
        // Get parent feedback with project info
        const parentFeedback = await prisma.feedback.findUnique({
            where: { id: feedbackId },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        creatorId: true,
                        clientId: true
                    }
                },
                author: {
                    select: { id: true }
                }
            }
        });

        if (!parentFeedback) {
            return NextResponse.json(
                { success: false, message: "Feedback not found" },
                { status: 404 }
            );
        }

        // Create reply
        const reply = await prisma.feedback.create({
            data: {
                projectId: parentFeedback.projectId,
                authorId: user.id as string,
                message: message.trim(),
                parentId: feedbackId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatarUrl: true,
                        role: true
                    }
                }
            }
        });

        await pusherServer.trigger(
            `project-${parentFeedback.projectId}`,
            'reply:created',
            {
                ...reply,
                parentId: feedbackId
            }
        );

        // Notify the original feedback author
        if (parentFeedback.authorId !== user.id) {
            await createNotification({
                userId: parentFeedback.authorId,
                title: "New Reply to Your Feedback",
                message: `${user.username} replied to your feedback on ${parentFeedback.project.title}`,
                type: "SYSTEM",
                link: `/projects/${parentFeedback.projectId}`
            });
        }

        return NextResponse.json({
            success: true,
            message: "Reply created successfully",
            data: reply
        });

    } catch (error) {
        console.error("Reply creation error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}