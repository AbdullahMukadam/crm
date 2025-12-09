import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient()
export async function GET(request: NextRequest, { params }: { params: Promise<{ proposalId: string }> }) {
    const { proposalId } = await params

    if (!proposalId) {
        return NextResponse.json({
            success: false,
            message: "Unable to get the ProposalId"
        })
    }

    try {

        const proposal = await prismaClient.proposal.findFirst({
            where: {
                id: proposalId
            },
            select: {
                id: true,
                title: true,
                content: true,
                status: true,
                amount: true,
                createdAt: true,
                updatedAt: true,
                creatorId: true,
                creator: true,
                clientId: true,
                project: true,
            }
        })

        if (!proposal) {
            return NextResponse.json({
                success: false,
                message: "Error Occured",
            })
        }

        return NextResponse.json({
            success: true,
            message: "Successfully fetched the data",
            data: {
                proposal: proposal
            }
        })

    } catch (error) {
        return NextResponse.json({
            success: true,
            message: "Successfully fetched the data"
        })
    }
}