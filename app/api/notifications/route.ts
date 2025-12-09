import { verifyUser } from "@/lib/middleware/verify-user";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function GET(request: NextRequest) {
    const { user, error } = await verifyUser(request)

    if (!user || error) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized User"
        })
    }

    const userId = user.id as string

    const notifications = await prisma.notification.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    const unreadCount = await prisma.notification.count({
        where: { userId: userId, isRead: false }
    });

    if (!notifications || !unreadCount) {
        return NextResponse.json({
            success: false,
            message: "Unable to get the Notifications"
        })
    }

    const data = {
        notifications,
        unreadCount
    }

    return NextResponse.json({
        success: true,
        message: "Notifications Fetced Successfully",
        data: data
    })
}
