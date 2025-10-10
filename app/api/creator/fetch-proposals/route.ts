import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient()

export async function GET(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        })
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id as string;
        
        const userProposals = await prismaClient.proposal.findMany({
            where: {
                creatorId: userId
            }
        })

        if(!userProposals){
            return NextResponse.json({
                success: false,
                message: "No Proposals Found"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Proposals Fetched Successfully",
            data: userProposals
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}