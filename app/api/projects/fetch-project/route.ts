import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const { id } = await request.json()

    if (!id) {
        return NextResponse.json({
            success: false,
            message: "Data not received"
        }, { status: 400 })
    }

    try {
        const response = await prisma.project.findUnique({
            where: {
                id: id
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

        if (!response) {
            return NextResponse.json({
                success: false,
                message: "Project not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Project Fetched Successfully",
            data: response
        })

    } catch (error) {
        console.error("Fetch project error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 })
    }
}