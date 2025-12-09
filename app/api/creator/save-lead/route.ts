import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
    const data = await request.json()

    if (!data) {
        return NextResponse.json({
            success: false,
            message: "Unable to received the Data"
        })
    }
    try {

        const findCreator = await prisma.user.findUnique({
            where: {
                username: data.username
            },
        })

        if (!findCreator) {
            return NextResponse.json({
                success: false,
                message: "Unable to find the Creator"
            })
        }

        const response = await prisma.lead.create({
            data: {
                name: data.name,
                companyName: data.companyName,
                email: data.email,
                mobileNumber: data.mobileNumber,
                note: data.note,
                userId: findCreator.id
            }
        })

        if (!response) {
            return NextResponse.json({
                success: false,
                message: 'Error Occured',
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Lead Created Successfully',
            data: response
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        })
    }

}