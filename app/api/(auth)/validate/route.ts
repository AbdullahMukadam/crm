import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return new Response(JSON.stringify({
            success: false,
            message: "No token found"
        }), { status: 401 });
    }

    try {
        const isverifiedToken = await verifyToken(token);

        if (!isverifiedToken || !isverifiedToken.id) {
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid token"
            }), { status: 401 });
        }

        const userDetails = await prisma.user.findUnique({
            where: {
                id: isverifiedToken.id
            },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                onboarded: true,
                avatarUrl : true,
            }
        })

        if (!userDetails) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Token is valid",
            data: userDetails
        });
    } catch (error) {
        console.error("Token validation error:", error);
        return NextResponse.json({
            success: false,
            message: "Token validation failed"
        }, { status: 401 });
    }

}