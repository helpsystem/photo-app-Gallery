import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/rbac/jwt';

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });

  // Clear JWT cookie
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });

  // Clear legacy cookie
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });

  return response;
}
