import { verifyUser } from "@/lib/middleware/verify-user";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
    const { user, error } = await verifyUser(request)

    if (!user && error) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated, Please Login First"
        }, { status: 401 })
    }

    const req = await request.json()
    const { status, proposalId } = req
    try {
        const response = await prisma.proposal.update({
            where: {
                id: proposalId
            },
            data: {
                status: status
            }
        })

        if (response) {
            return NextResponse.json({
                success: true,
                message: "Proposal Status Updated Successfully"
            })
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}