import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 如果是登录页面，直接放行
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    if (sessionId) {
      const isValidSession = await kv.get(`session:${sessionId}`);
      if (isValidSession) {
        return NextResponse.next();
      }
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
