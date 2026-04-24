import createMiddleware from 'next-intl/middleware';
import {NextResponse, type NextRequest} from 'next/server';
import {routing} from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

/**
 * /admin routes bypass next-intl (they have their own UI, no locale switch)
 * and are guarded by a cookie-presence check. Real auth verification happens
 * inside each admin server component via `requireAdmin()`.
 *
 * All other routes go through next-intl routing as before.
 */
export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login')) {
      return NextResponse.next();
    }
    const cookie = request.cookies.get('diacorp_admin');
    if (!cookie?.value) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
