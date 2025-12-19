import { verifyUser } from "@/lib/middleware/verify-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { user, error } = await verifyUser(request)
    if (!user || error) {
        return NextResponse.json({
            success: false,
            message: "Unable to get the User"
        })
    }

    try {
        const leads = await prisma.lead.findMany({
            where: {
                userId : user.id as string
            }
        })

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