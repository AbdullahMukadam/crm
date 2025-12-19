import { verifyUser } from "@/lib/middleware/verify-user";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const { user, error } = await verifyUser(request)
    const payload = await request.json()

    if (!user || error) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized User"
        })
    }

    const notification = await prisma.notification.update({
        where: {
            id: payload
        },
        data: {
            isRead: true
        }
    })

    if (!notification) {
        return NextResponse.json({
            success: false,
            message: "Unable to get the Notification"
        })
    }

    return NextResponse.json({
        success: true,
        message: "Notifications Updated Successfully",
    })
}
