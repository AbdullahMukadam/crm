import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const proposalId = await request.json()

    if (!proposalId) {
        return NextResponse.json({
            success: false,
            message: "Unable to get the Data"
        })
    }

    try {

        const proposal = await prisma.proposal.delete({
            where: {
                id: proposalId
            },
            select: {
                id: true
            }
        })

        if (!proposal) {
            return NextResponse.json({
                success: false,
                message: "Unable to Delete the Proposal"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Proposal Deleted Succesfully"
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}