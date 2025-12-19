import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verify-token";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({
                success: false,
                message: "No authentication token found"
            }, { status: 401 });
        }

        const decoded = await verifyToken(token);

        if (!decoded || !decoded.id) {
            return NextResponse.json({
                success: false,
                message: "Invalid token"
            }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                onboarded: true,
                avatarUrl: true
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to get user data"
        }, { status: 500 });
    }
}