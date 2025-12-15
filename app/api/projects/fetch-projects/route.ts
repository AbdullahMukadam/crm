import { verifyUser } from "@/lib/middleware/verify-user";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()
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
                        id : true,
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