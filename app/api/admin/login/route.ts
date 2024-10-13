import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { kv } from '@vercel/kv';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === ADMIN_PASSWORD) {
    const sessionId = randomBytes(16).toString('hex');
    await kv.set(`session:${sessionId}`, true, { ex: 3600 }); // 设置1小时过期
    const response = NextResponse.json({ success: true });
    response.cookies.set('session_id', sessionId, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    });
    return response;
  } else {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
