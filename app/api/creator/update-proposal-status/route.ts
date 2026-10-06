import { createNotification } from "@/lib/createNotifications";
import { verifyUser } from "@/lib/middleware/verify-user";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const { user, error } = await verifyUser(request)

    if (!user || error) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated, Please Login First"
        }, { status: 401 })
    }

    const req = await request.json()
    const { status, proposalId, signature } = req
    try {
        // Stamp the client's typed name into any signature blocks on accept
        const existing = await prisma.proposal.findUnique({ where: { id: proposalId }, select: { content: true } })
        const blocks = Array.isArray(existing?.content) ? (existing.content as any[]) : []
        const hasSignatureBlock = blocks.some((b) => b?.type === "signature")
        const signedName = typeof signature === "string" ? signature.trim().slice(0, 100) : ""

        if (status === "ACCEPTED" && hasSignatureBlock && !signedName) {
            return NextResponse.json({
                success: false,
                message: "Please sign the proposal before accepting"
            }, { status: 400 })
        }

        const signedContent = status === "ACCEPTED" && hasSignatureBlock
            ? blocks.map((b) => b?.type === "signature"
                ? { ...b, props: { ...b.props, signedName, signedAt: new Date().toISOString() } }
                : b)
            : undefined

        const response = await prisma.proposal.update({
            where: {
                id: proposalId
            },
            data: {
                status: status,
                clientId: user.id as string,
                ...(signedContent && { content: signedContent })
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