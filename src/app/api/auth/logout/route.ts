import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = NextResponse.json({ success: true });
    res.cookies.set('token', '', { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 0, path: '/' });
    return res;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}