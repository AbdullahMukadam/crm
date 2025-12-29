
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {

        const response = await prisma.branding.findMany({
            select: {
                id: true,
                formFeilds: true,
                creatorId: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        const data = {
            id: response[0].id,
            formFeilds: response[0].formFeilds,
            creatorId: response[0].creatorId,
            username: response[0].username,
            createdAt: response[0].createdAt,
            updatedAt: response[0].updatedAt,
        }

        if (!response) {
            return NextResponse.json({
                success: false,
                message: "Error Occured",
            })
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