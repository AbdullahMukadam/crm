import { createToken } from "@/utils/create-token";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { userId, role } = reqBody;
        console.log("Onboarding data received:", reqBody);

        if (!userId || !role) {
            return NextResponse.json({
                success: false,
                message: "userId and role are required for onboarding"
            })
        }

        const isUserPressent = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!isUserPressent) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        const upperCaseRole = role.toUpperCase() as Role;

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role: upperCaseRole,
                onboarded: true
            },
            select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
                role: true,
                onboarded: true
            }
        })
        const tokenData = {
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
            onboarded: updatedUser.onboarded,
            role: updatedUser.role
        }

        const token = await createToken(tokenData)

        const response = NextResponse.json({
            success: true,
            message: "User onboarded successfully",
            data: updatedUser
        }, { status: 200 })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
            path: "/",
        })

        return response

    } catch (error) {
        console.error("Error processing onboarding data:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 })
    }
}