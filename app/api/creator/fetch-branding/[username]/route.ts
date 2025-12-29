
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    try {

        const response = await prisma.branding.findFirst({
            where: {
                username: username
            },
            select: {
                id: true,
                formFeilds: true,
                creatorId: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        if (!response) {
            return NextResponse.json({
                success: false,
                message: "Error Occured",
            })
        }

        const data = {
            id: response.id,
            formFeilds: response.formFeilds,
            creatorId: response.creatorId,
            username: response.username,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
        }


        return NextResponse.json({
            success: true,
            message: "data fetch successfully",
            data: data
        })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "An Internal Server Error"
        })
    }
}