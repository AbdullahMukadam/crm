import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}