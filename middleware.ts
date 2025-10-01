// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard','/boat','/training','/onboarding','/level','/shifts','/admin'];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r));

  // Cerca cookie "sb-<projectRef>-auth-token"
  const authCookie = req.cookies.getAll().find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));

  console.log('[MW]', pathname, {
    cookieNames: req.cookies.getAll().map(c => c.name),
    authToken: authCookie ? 'PRESENTE' : 'ASSENTE'
  });

  if (isProtected && !authCookie) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };