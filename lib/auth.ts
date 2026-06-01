import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';

function secret() {
  return process.env.AUTH_SECRET || 'dev-secret-change-me';
}

export function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function sign(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

export function createToken(username: string) {
  const expires = Date.now() + 1000 * 60 * 60 * 8;
  const payload = `${username}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token?: string) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [username, expires, signature] = parts;
  const payload = `${username}.${expires}`;
  const expected = sign(payload);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  return Number(expires) > Date.now() && username === (process.env.ADMIN_USERNAME || 'admin');
}

export async function isLoggedIn() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}

export async function setLoginCookie(username: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(username), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  });
}

export async function clearLoginCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
