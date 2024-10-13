import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { kv } from '@vercel/kv';

export async function POST() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('session_id')?.value;
  
  if (sessionId) {
    await kv.del(`session:${sessionId}`);
  }
  
  const response = NextResponse.json({ success: true });
  response.cookies.delete('session_id');
  return response;
}
