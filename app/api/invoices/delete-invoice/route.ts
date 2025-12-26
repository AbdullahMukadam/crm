
import { verifyUser } from "@/lib/middleware/verify-user";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { user, error } = await verifyUser(request)
    const data = await request.json()

    if (!data || !user || error) {
        return NextResponse.json({
            success: false,
            message: "Unable to get the data"
        })
    }

    try {
        const response = await prisma.invoice.delete({
            where: {
                id: data.id
            }
        })

        if (!response) {
            return NextResponse.json({
                success: false,
                message: "Unable to delete the Invoice",
            });
        }

        return NextResponse.json({
            success: true,
            message: "Invoice Deleted successfully",
            data: response
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}