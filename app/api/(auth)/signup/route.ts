import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { createToken } from "@/lib/create-token";
import 'dotenv/config'

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

        if (isUserPresent) {
            return NextResponse.json({
                success: false,
                message: "The User Already Exists, Please Enter different email"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(userCredentials.password, salt)

        const newUser = await prismaClient.user.create({
            data: {
                username: userCredentials.username,
                email: userCredentials.email,
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                onboarded: true,
                avatarUrl: true

            }
        })

        if (!newUser) {
            return NextResponse.json({
                success: false,
                message: "An errror Occured in Creating User"
            })
        }

        const tokenData = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username
        }
        const token = await createToken(tokenData)

        const response = NextResponse.json({
            success: true,
            message: "User Created Succesfully",
            data: newUser
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
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }

}