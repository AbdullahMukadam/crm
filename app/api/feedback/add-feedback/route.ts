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
        const { id, ...updateData } = data;

        // Remove the duplicate feedback creation - this is creating duplicates!
        // Just use the update below

        const response = await prisma.project.update({
            where: {
                id: id
            },
            data: {
                Feedback: {
                    create: {
                        authorId: user.id as string,
                        message: updateData.message
                    }
                }
            },
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
                        author: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                avatarUrl: true,
                                role: true
                            }
                        },
                        replies: true,
                        message: true,
                        authorId: true,
                        projectId: true,
                        createdAt: true,
                        updatedAt: true

                    }
                }
            }
        })

        if (!response) {
            return NextResponse.json({
                success: false,
                message: "Unable to update the project"
            })
        }

        // Notify the project creator or client (not the person who left feedback)
        const notifyUserId = user.id === response.creatorId ? response.clientId : response.creatorId;

        await createNotification({
            userId: notifyUserId,
            title: `New Feedback on Project`,
            message: `${user.username} provided feedback on ${response.title}`,
            type: "SYSTEM",
        });

        return NextResponse.json({
            success: true,
            message: "Feedback Created Successfully",
            data: response
        })

    } catch (error) {
        console.error("Feedback creation error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}