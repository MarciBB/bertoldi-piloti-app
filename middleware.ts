import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard','/boat','/training','/onboarding','/level','/shifts','/admin'];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isProtected = protectedRoutes.some(r => url.pathname.startsWith(r));
  const token = req.cookies.get('sb-access-token');
  if (isProtected && !token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
