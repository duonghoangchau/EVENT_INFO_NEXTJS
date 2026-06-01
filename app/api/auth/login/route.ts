import { NextRequest, NextResponse } from 'next/server';
import { setLoginCookie, sha256 } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const username = String(form.get('username') || '');
  const password = String(form.get('password') || '');
  const okUser = username === (process.env.ADMIN_USERNAME || 'admin');
  const okPass = sha256(password) === (process.env.ADMIN_PASSWORD_HASH || 'ad89b64d66caa8e30e5d5ce4a9763f4ecc205814c412175f3e2c50027471426d');
  if (!okUser || !okPass) return NextResponse.redirect(new URL('/admin/login?error=1', req.url), 303);
  await setLoginCookie(username);
  return NextResponse.redirect(new URL('/admin', req.url), 303);
}
