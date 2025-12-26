import { verifyUser } from "@/lib/middleware/verify-user";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { user, error } = await verifyUser(request)

    if (!user || error) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        })
    }
    try {

        const response = await prisma.project.findMany({
            where: {
                OR: [
                    {
                        clientId: user.id as string
                    },
                    {
                        creatorId: user.id as string
                    }
                ]
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
                deliverables : true,
                invoices : {
                    select : {
                        id: true,
                        invoiceNumber: true,
                        amount: true,
                        dueDate: true,
                        paidAt: true,
                        status: true,
                        createdAt: true,
                        clientId: true,
                        projectId: true,
                        client: true,
                        project: true,
                    }
                },
                client: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatarUrl: true,
                        role: true,
                        createdAt: true,
                        onboarded: true,
                        updatedAt: true
                    }
                },
                creator: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatarUrl: true,
                        role: true,
                        createdAt: true,
                        onboarded: true,
                        updatedAt: true
                    }
                },
                embedLink: true,
                Feedback: {
                    where: {
                        parentId: null  // ✅ CRITICAL: Only get top-level feedback
                    },
                    select: {
                        id: true,
                        message: true,
                        authorId: true,
                        projectId: true,
                        createdAt: true,
                        updatedAt: true,
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
                                },
                                replies: {  // Optional: if you want nested replies
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
                                }
                            },
                            orderBy: {
                                createdAt: 'asc'  // Chronological order for replies
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'  // Newest feedback first
                    }
                }
            }

        })

        if (response.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No Projects Found",
                data: []
            })
        }

        return NextResponse.json({
            success: true,
            message: "Projects retrieved successfully",
            data: response
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}