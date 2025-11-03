import { verifyUser } from "@/lib/middleware/verify-user";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient()
export async function GET(request: NextRequest) {
    try {
        const { user, error } = await verifyUser(request)
        if (!user || error) {
            return NextResponse.json({
                success: false,
                message: "Data not received"
            })
        }

        const response = await prismaClient.branding.findMany({
            select: {
                id: true,
                formFeilds: true,
                creatorId: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        if(response){
            return NextResponse.json({
                success : true,
                message : "data fetch successfully",
                data : response
            })
        }

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "An Internal Server Error"
        })
    }
}