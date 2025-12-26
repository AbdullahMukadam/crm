
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

        const { id, ...updatedData } = data

        const invoice = await prisma.invoice.update({
            where: {
                id: data.id
            },
            data: updatedData,
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
                client: true,
                project: true
            }
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