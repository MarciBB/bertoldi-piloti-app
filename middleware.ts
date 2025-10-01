// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard','/boat','/training','/onboarding','/level','/shifts','/admin'];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r));

  // --- 👇 Log rapido ---
  const cookies = req.cookies.getAll().map(c => `${c.name}=${c.value.slice(0,10)}...`);
  console.log('[MW]', pathname, 'cookies:', cookies);

  const token = req.cookies.get('sb-access-token');
  if (isProtected && !token) {
    console.warn('[MW] redirect → /login (manca sb-access-token) per', pathname);
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };