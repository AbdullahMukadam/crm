import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


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
        const proposal = await prisma.proposal.create({
            data: {
                title: title,
                creatorId: creatorId,
            },
            select: {
                id: true,
                title: true,
            }
        })

        if (!proposal) {
            return NextResponse.json({
                success: false,
                message: "Unable to Create Proposal"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Got the data",
            data : {
                proposal: proposal
            }
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error"
        })
    }
}