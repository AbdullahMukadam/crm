
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export async function verifyUser(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return { user: null, error: "Token missing" };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return { user: payload, error: null };
  } catch (err) {
    console.error("JWT verification failed:", err);
    return { user: null, error: "Invalid token" };
  }
}
