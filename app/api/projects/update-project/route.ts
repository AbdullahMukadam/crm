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

        const response = await prisma.project.update({
            where: {
                id: id
            },
            data: updateData,
            select : {
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
                creator: true
            }
        })

        if (!response) {
            return NextResponse.json({
                success: false,
                message: "Unable to update the project"
            })
        }

        await createNotification({
            userId: user.id as string,
            title: `Project Updated`,
            message: `Your Project ${response.title} was updated by ${user.username}`,
            type: "SYSTEM",
        });

        return NextResponse.json({
            success: true,
            message: "Project updated Successfully",
            data: response
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}