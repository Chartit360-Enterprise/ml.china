import { NextRequest, NextResponse } from 'next/server';

// Use Edge runtime for longer timeout (up to 30s vs 10s for hobby serverless)
export const runtime = 'edge';

// Increase max duration for Pro/Enterprise plans (hobby is limited to 10s)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const endpoint = process.env.AWS_API_ENDPOINT!;
    const body = await req.text();
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      // Don't cache, and allow longer timeout
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ success: false, error: error?.message || 'proxy_error' }, { status: 500 });
  }
}

