import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
    const { id } = await request.json()

    if (!id) {
        return NextResponse.json({
            success: false,
            message: "Data not received"
        })
    }
    try {

        const response = await prisma.project.findFirst({
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

        if (!response) {
            return NextResponse.json({
                success: false,
                message: "Unable to fetch the Project"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Project Fetched Successfully",
            data: response
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}