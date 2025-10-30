import { verifyUser } from "@/lib/middleware/verify-user";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient()
export async function POST(request: NextRequest) {
    const { user, error } = await verifyUser(request)
    const data = await request.json()

    if (!data || !user || error) {
        return NextResponse.json({
            success: false,
            message: 'Data not received'
        })
    }

    const { feilds } = data

    try {
        const updateBranding = await prismaClient.branding.create({
            data: {
                creatorId: user.id as string,
                formFeilds: feilds
            },
            select: {
                creatorId: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (updateBranding) {
            return NextResponse.json({
                success: true,
                message: 'Branding Created sucessfully',
                data: updateBranding
            })
        }

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        })
    }

}