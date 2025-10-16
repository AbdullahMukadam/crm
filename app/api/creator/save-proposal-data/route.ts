import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const data = await request.json()

    try {

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}