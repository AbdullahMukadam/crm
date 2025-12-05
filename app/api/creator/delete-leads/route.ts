import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prismaClient = new PrismaClient()
export async function POST(request: NextRequest) {
    const data = await request.json()
    if (!data) {
        return NextResponse.json({
            success: false,
            message: "Data not received"
        })
    }   
    try {
        const deletedlead = await prismaClient.lead.delete({
            where: {
                id: data
            },
        })

        if (!deletedlead) {
            return NextResponse.json({
                success: false,
                message: "Unable to Delete Lead"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Deleted Successfully"
        })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}