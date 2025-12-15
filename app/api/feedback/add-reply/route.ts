import { createNotification } from "@/lib/createNotifications";
import { verifyUser } from "@/lib/middleware/verify-user";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest) {
    const { user, error } = await verifyUser(request)
    const data = await request.json()

    if (!data || !user || error) {
        return NextResponse.json({
            success: false,
            message: "Unable to get the data"
        })
    }

    try {
        const { id, feedbackId, message } = data;

        const reply = await prisma.feedback.create({
            data: {
                projectId: id,
                authorId: user.id as string,
                message: message,
                Feedback: {
                    connect: { id: feedbackId } // Connect to parent feedback
                }
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

        // Get project details for notification
        const project = await prisma.project.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                creatorId: true,
                clientId: true,
                proposalId: true,
                client: true,
                creator: true,
                embedLink: true,
                Feedback: {
                    select: {
                        id: true,
                        author: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                avatarUrl: true,
                                role: true
                            }
                        },
                        replies: {
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
                        },
                        message: true,
                        authorId: true,
                        projectId: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        });

        // Notify the project creator or client
        if (project) {
            const notifyUserId = user.id === project.creatorId ? project.clientId : project.creatorId;

            await createNotification({
                userId: notifyUserId,
                title: `New Reply on Project Feedback`,
                message: `${user.username} replied to feedback on ${project.title}`,
                type: "SYSTEM",
            });
        }

        return NextResponse.json({
            success: true,
            message: "Reply Created Successfully",
            data: project
        });


    } catch (error) {
        console.error("Feedback creation error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}