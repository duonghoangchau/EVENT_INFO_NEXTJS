import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { isLoggedIn } from '@/lib/auth';

export async function GET() {
  if (!(await isLoggedIn())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await getContent());
}

export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const text = await req.text();
  if (text.length > 500_000) return NextResponse.json({ message: 'Dữ liệu quá lớn' }, { status: 413 });
  const body = JSON.parse(text);
  await saveContent(body);
  return NextResponse.json({ ok: true });
}
