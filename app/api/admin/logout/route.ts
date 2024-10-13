import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: Request) {
  const sessionId = request.cookies.get('session_id')?.value;
  if (sessionId) {
    await kv.del(`session:${sessionId}`);
  }
  const response = NextResponse.json({ success: true });
  response.cookies.delete('session_id');
  return response;
}
