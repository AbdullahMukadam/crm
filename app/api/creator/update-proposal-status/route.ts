import { createNotification } from "@/lib/createNotifications";
import { verifyUser } from "@/lib/middleware/verify-user";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
    const { user, error } = await verifyUser(request)

    if (!user || error) {
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
                status: status,
                clientId: user.id as string
            }
        })

        if (!response) {
            return NextResponse.json({
                success: false,
                message: "Error Occured"
            })
        }


        const ProposalStatus = status === "ACCEPTED" ? "PROPOSAL_ACCEPTED" : "PROPOSAL_DECLINED"

        if (status === "ACCEPTED") {
            const newProject = await prisma.project.create({
                data: {
                    title: response.title,
                    creatorId: response.creatorId,
                    clientId: response.clientId || user.id as string,
                    proposalId: proposalId,
                }
            })

            if (!newProject) {
                return NextResponse.json({
                    success: false,
                    message: "Unable to Create an Project"
                })
            }
        }

        await createNotification({
            userId: response.creatorId,
            title: `Proposal ${status === "ACCEPTED" ? "Accepted!" : "Rejected"}`,
            message: `Your proposal "${response.title}" ${status === "ACCEPTED" ? "has been Accepted!" : "has been Rejected"}`,
            type: ProposalStatus,
        });

        return NextResponse.json({
            success: true,
            message: "Proposal Status Updated Successfully, Login to your Portal to get More details."
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}