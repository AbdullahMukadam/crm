import { verifyUser } from "@/lib/middleware/verify-user";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prismaClient = new PrismaClient()
export async function POST(request: NextRequest) {
    const { user, error } = await verifyUser(request)
    const data = await request.json()

    if (!data || error || !user) {
        return NextResponse.json({
            success: false,
            message: "Data not received"
        })
    }
    try {
        const { blocks, proposalId } = data

        const proposal = await prismaClient.proposal.update({
            where: {
                id: proposalId
            },
            data: {
                content: blocks,
                creatorId: user.id as string
            },
            select: {
                content: true
            }
        })

        if (proposal) {
            return NextResponse.json({
                success: true,
                message: "Data received"
            })
        }

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}