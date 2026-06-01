import { NextRequest, NextResponse } from 'next/server';
import { clearLoginCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await clearLoginCookie();
  return NextResponse.redirect(new URL('/admin/login', req.url), 303);
}
