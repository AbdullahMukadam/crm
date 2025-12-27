import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verify-token";
import { prisma } from "@/lib/prisma";
import { verifyUser } from "@/lib/middleware/verify-user";

export async function PATCH(request: NextRequest) {
    const data = await request.json()
    const {user, error} = await verifyUser(request)

    if (!data || !user || error) {
        return NextResponse.json({
            success: false,
            message: "data not received"
        })
    }
    try {

        const {...updatedData } = data

        const response = await prisma.user.update({
            where: {
                id: user.id as string
            },
            data: updatedData
        })

        if (!response) {
            return NextResponse.json({
                success: false,
                message: "unable to update"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            data: response
        })


    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to get user data"
        }, { status: 500 });
    }
}