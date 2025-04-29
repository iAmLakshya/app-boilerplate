'use server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Constants from '@/constants';
// import { verifyAuth } from '@app/auth';

const verifyAuthCookie = async () => {
  try {
    const sessionCookie = (await cookies()).get(Constants.auth.SESSION_COOKIE);
    if (!sessionCookie?.value) return false;

    // TODO: Verify session cookie without firebase admin sdk
    return true;
  } catch (err) {
    return false;
  }
};
export async function middleware(req: NextRequest) {
  // Get the pathname
  const path = req.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Define auth routes
  const authRoutes = ['/login', '/register', '/forgot-password'];
  const isAuthRoute = authRoutes.some((route) => path === route);

  // Verify authentication
  const isAuthenticated = await verifyAuthCookie();

  // // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('next', path);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
