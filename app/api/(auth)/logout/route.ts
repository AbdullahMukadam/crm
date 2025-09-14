import { NextResponse } from "next/server";


export async function POST() {

    const response = NextResponse.json({
        success: true,
        message: "Logged Out Successfully"
    })

    response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
    })

    return response
}