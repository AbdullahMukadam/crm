import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
    const { id } = await request.json()

    if (!id) {
        return NextResponse.json({
            success: false,
            message: "Data not received"
        })
    }
    try {

        const response = await prisma.project.delete({
            where: {
                id: id
            }
        })

        if(!response){
            return NextResponse.json({
                success: false,
                message: "Unable to delete the Project"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Project Deleted Successfully"
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}