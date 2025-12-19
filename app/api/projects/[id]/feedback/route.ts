// app/api/projects/[id]/feedback/route.ts
import { createNotification } from "@/lib/createNotifications";
import { verifyUser } from "@/lib/middleware/verify-user";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { user, error } = await verifyUser(request);
    const body = await request.json();
    const {id} = await params

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
        // Verify project exists and get creator/client info
        const project = await prisma.project.findUnique({
            where: { id: id },
            select: { 
                id: true, 
                title: true, 
                creatorId: true, 
                clientId: true 
            }
        });

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        // Create feedback directly (simpler, more efficient)
        const feedback = await prisma.feedback.create({
            data: {
                projectId: id,
                authorId: user.id as string,
                message: message.trim()
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
            `project-${id}`,  // channel name
            'feedback:created',      // Event name
            feedback  //data
        )

        // Notify the other party (not the author)
        const notifyUserId = user.id === project.creatorId 
            ? project.clientId 
            : project.creatorId;

        await createNotification({
            userId: notifyUserId,
            title: "New Feedback on Project",
            message: `${user.username} provided feedback on ${project.title}`,
            type: "SYSTEM",
            link: `/projects/${project.id}` // Add link for better UX
        });

        return NextResponse.json({
            success: true,
            message: "Feedback created successfully",
            data: feedback
        });

    } catch (error) {
        console.error("Feedback creation error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}