import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const Prisma = new PrismaClient()
export async function POST(request: NextRequest) {

    const data = await request.json()
    if (!data) {
        return NextResponse.json({
            success: false,
            message: "Unable to get the data"
        })
    }

    try {

        const { title, creatorId } = data
        const user = await Prisma.user.findFirst({
            where: {
                id: creatorId
            }
        })

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Unable to get the data"
            })
        }

        

        return NextResponse.json({
            success: true,
            message: "Got the data"
        })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error"
        })
    }
}