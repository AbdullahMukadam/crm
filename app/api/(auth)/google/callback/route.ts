import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/utils/create-token";

interface GoogleTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    id_token: string;
}

interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error || !code) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=oauth_failed`);
        }

        // Exchange code for access token
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/google/callback`,
                grant_type: "authorization_code",
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error("Failed to exchange code for token");
        }

        const tokens: GoogleTokenResponse = await tokenResponse.json();

        // Get user info from Google
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        if (!userInfoResponse.ok) {
            throw new Error("Failed to fetch user info");
        }

        const googleUser: GoogleUserInfo = await userInfoResponse.json();

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { email: googleUser.email },
        });

        if (!user) {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email: googleUser.email,
                    username: googleUser.email.split("@")[0],
                    password: "", // No password for OAuth users
                    avatarUrl: googleUser.picture,
                    googleId: googleUser.id,
                },
            });
        } else if (!user.googleId) {
            // Link Google account to existing user
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    googleId: googleUser.id,
                    avatarUrl: user.avatarUrl || googleUser.picture,
                },
            });
        }

        const tokenData = {
            id: user.id,
            email: user.email,
            username: user.username,
            onboarded: user.onboarded,
            role: user.role,
        };

        const token = await createToken(tokenData);

        // Create the full redirect URL
        const redirectUrl = new URL(
            user.onboarded ? `/dashboard/${user.role?.toLowerCase()}` : "/onboard",
            process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
        );

        const response = NextResponse.redirect(redirectUrl);

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Google OAuth error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=oauth_error`);
    }
}