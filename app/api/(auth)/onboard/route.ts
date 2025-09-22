import { PrismaClient, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient()

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

        const isUserPressent = await prismaClient.user.findUnique({
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

        const updatedUser = await prismaClient.user.update({
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

        return NextResponse.json({
            success: true,
            message: "User onboarded successfully",
            data: updatedUser
        }, { status: 200 })

    } catch (error) {
        console.error("Error processing onboarding data:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 })
    }
}