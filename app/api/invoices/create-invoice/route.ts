import { createNotification } from "@/lib/createNotifications";
import { verifyUser } from "@/lib/middleware/verify-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

        //add feedback

        const response = await prisma.project.update({
            where: {
                id: id
            },
            data: {
                invoices: {
                    create: {
                        invoiceNumber : data.invoiceNumber,
                        amount : data.amount,
                        dueDate : data.dueDate,
                        status : data.status,
                        clientId : data.client.id,
                        projectId : data.projectId
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
                        id: true,
                        replies: true,
                        message: true,
                        authorId: true,
                        projectId: true,
                        createdAt: true,
                        updatedAt: true

                    }
                },
                invoices : true
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
            title: `New Invoices Created.`,
            message: `${user.username} created new invoice`,
            type: "SYSTEM",
        });

        return NextResponse.json({
            success: true,
            message: "New Invoices Created.",
            data: response
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}