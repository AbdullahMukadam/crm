import { verifyUser } from "@/lib/middleware/verify-user";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const { user, error } = await verifyUser(request)
    const { query } = await request.json()

    if (!user || error || !query) {
        return NextResponse.json({
            success: false,
            message: "Data is Invalid"
        })
    }

    const searchString = query.trim()

    try {

        const response = await prisma.lead.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        companyName: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        mobileNumber: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        note: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                ]
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        if (response.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No Leads Found, Try creating one",
                data : []
            })
        }

        return NextResponse.json({
            success: true,
            message: "Leads Retrived Successfully",
            data: response
        })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}