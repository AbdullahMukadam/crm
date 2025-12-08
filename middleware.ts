

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// --- Granular Access Rules ---
const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/dashboard/admin': ['ADMIN'],
  '/dashboard/creator': ['ADMIN', 'CREATOR'],
  '/dashboard/client': ['CLIENT'],
  '/portal': ['CLIENT'],
  '/settings': ['ADMIN', 'CREATOR'],
  '/dashboard': ['ADMIN', 'CREATOR'], 
};

const homePages: Record<string, string> = {
  ADMIN: '/dashboard/admin',
  CREATOR: '/dashboard/creator',
  CLIENT: '/dashboard/client',
};


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const publicRoutes = ['/signin', '/signup', '/access-denied', "/", "/lead-form", "/proposals"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/signin', request.url);
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

 
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET not set');

    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);

    const role = payload.role as keyof typeof homePages;
    const onboarded = payload.onboarded as boolean;

    // Onboarding check
    if (!onboarded && pathname !== '/onboard') {
      return NextResponse.redirect(new URL('/onboard', request.url));
    }
    if (onboarded && pathname === '/onboard') {
      return NextResponse.redirect(new URL(homePages[role], request.url));
    }


    if (onboarded) {
      // Find all matching prefixes for the current path
      const matchingPrefixes = Object.keys(roleBasedRoutes).filter((prefix) =>
        pathname.startsWith(prefix)
      );

      // Find the longest (most specific) matching prefix
      const mostSpecificPrefix = matchingPrefixes.reduce(
        (longest, current) => (current.length > longest.length ? current : longest),
        ''
      );


      if (mostSpecificPrefix) {
        const allowedRoles = roleBasedRoutes[mostSpecificPrefix];
        if (!allowedRoles.includes(role)) {
          return NextResponse.redirect(new URL('/access-denied', request.url));
        }
      }
    }


    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token:", error);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
   '/((?!api|_next/static|_next/image|favicon.ico|signin|signup|access-denied|lead-form|proposals|$).*)',
  ],
};