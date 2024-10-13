import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  const totalRequests = await kv.get('total_requests') || 0;
  
  return NextResponse.json({ totalRequests });
}
