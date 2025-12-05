import { verifyUser } from "@/lib/middleware/verify-user";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient()
export async function GET(request: NextRequest) {
    const { user, error } = await verifyUser(request)
    if (!user || error) {
        return NextResponse.json({
            success: false,
            message: "Unable to get the User"
        })
    }

    try {
        const leads = await prismaClient.user.findFirst({
            where: {
                id: user.id as string
            },
            select: {
                leads: true
            }
        })

        console.log(leads)

        if (!leads) {
            return NextResponse.json({
                success: false,
                message: "Leads not found"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Leads retrieved succesfully",
            data: leads
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}