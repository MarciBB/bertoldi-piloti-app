// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard','/boat','/training','/onboarding','/level','/shifts','/admin'];

// Facciamo log solo su login e sulle route protette per non inondare i log
function shouldLog(pathname: string) {
  return pathname === '/login' || protectedRoutes.some(r => pathname.startsWith(r));
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r));

  // Leggi cookie (solo presenza, no contenuti sensibili)
  const access = req.cookies.get('sb-access-token')?.value;
  const refresh = req.cookies.get('sb-refresh-token')?.value;

  if (shouldLog(pathname)) {
    // Elenco nomi cookie disponibili (debug non sensibile)
    const names = req.cookies.getAll().map(c => c.name);
    console.log('[MW]', pathname, {
      cookieNames: names,
      access: access ? 'PRESENTE' : 'ASSENTE',
      refresh: refresh ? 'PRESENTE' : 'ASSENTE'
    });
  }

  if (isProtected && !access) {
    // Logghiamo anche il redirect (utile per capire perché resti su /login)
    console.warn('[MW] redirect → /login (manca sb-access-token) per', pathname);
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Mantieni il matcher ampio, ma puoi restringerlo se vuoi
export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };