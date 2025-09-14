

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { createToken } from "@/lib/create-token";

const prismaClient = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        if (!data.userCredentials) {
            return NextResponse.json({
                success: false,
                message: "UserCredentials Not Received"
            })
        }

        const { userCredentials } = data;
        const isUserPresent = await prismaClient.user.findUnique({
            where: {
                email: userCredentials.email
            }
        })

        if (!isUserPresent) {
            return NextResponse.json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(userCredentials.password, isUserPresent.password)
        if (!isPasswordCorrect) {
            return NextResponse.json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const userData = {
            id: isUserPresent.id,
            email: isUserPresent.email,
            username: isUserPresent.username,
            role: isUserPresent.role,
            onboarded: isUserPresent.onboarded,
            avatarUrl: isUserPresent.avatarUrl
        }

        const tokenData = {
            id: isUserPresent.id,
            email: isUserPresent.email,
            username: isUserPresent.username,
        }

        const token = await createToken(tokenData)
        const response = NextResponse.json({
            success: true,
            message: "Signed In Successfully",
            data: userData
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
            path: "/",
        })

        return response

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "An error occurred during sign-in"
        })
    }
}