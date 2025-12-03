import { verifyUser } from "@/lib/middleware/verify-user";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const data = await request.json()
    const { user, error } = await verifyUser(request)

    if (!data || !user || error) {
        return NextResponse.json({
            success: false,
            message: "Data not received"
        })
    }

    try {
        const { id, Label } = data;

        const host = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'http://localhost:3000';
        const source = Label.toLowerCase().replace(/\s+/g, '-');
        const username = user.username as string
        const generatedUrl = `${host}/lead-form/${username.toLowerCase()}?utm_source=${source}`;

        return NextResponse.json({
            success: true,
            data : generatedUrl,
            message: "URL Generated Successfully"
        })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}