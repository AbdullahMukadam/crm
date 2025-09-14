
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const loginUrl = new URL('/signin', request.url);
  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(loginUrl);
  }


  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return NextResponse.redirect(loginUrl);
    }

    // The secret key must be converted to a Uint8Array for jose.
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);
    return NextResponse.next();

  } catch (error) {
    console.error("Invalid token:", error);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('token', '', { 
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    return response;
  }
}


export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile',
    '/onboard',
  ],
};