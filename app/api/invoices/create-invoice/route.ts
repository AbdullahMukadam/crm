import { createNotification } from "@/lib/createNotifications";
import { verifyUser } from "@/lib/middleware/verify-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    const { user, error } = await verifyUser(request)
    const data = await request.json()

    if (!data || !user || error) {
        return NextResponse.json({
            success: false,
            message: "Unable to get the data"
        })
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id: data.projectId },
            select: {
                id: true,
                title: true,
                creatorId: true,
                clientId: true
            }
        });

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        // Create feedback directly (simpler, more efficient)
        const invoice = await prisma.invoice.create({
            data: {
                projectId: data.projectId,
                invoiceNumber: data.invoiceNumber,
                amount: data.amount,
                dueDate: data.dueDate,
                status: data.status,
                clientId: data.clientId
            },
            select: {
                id: true,
                createdAt: true,
                clientId: true,
                status: true,
                projectId: true,
                invoiceNumber: true,
                amount: true,
                dueDate: true,
                paidAt: true,
                client : true,
                project : true
            }
        });

        // Notify the other party (not the author)
        const notifyUserId = user.id === project.creatorId
            ? project.clientId
            : project.creatorId;

        await createNotification({
            userId: notifyUserId,
            title: "New Invoice Created",
            message: `${user.username} created new invoice for ${project.title}`,
            type: "SYSTEM",
            link: `` // Add link for better UX
        });

        return NextResponse.json({
            success: true,
            message: "Invoice Created successfully",
            data: invoice
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}