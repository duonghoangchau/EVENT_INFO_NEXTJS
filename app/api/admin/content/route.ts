import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { isLoggedIn } from '@/lib/auth';

export async function GET() {
  if (!(await isLoggedIn())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await getContent());
}

export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const text = await req.text();
    if (text.length > 500_000) {
      return NextResponse.json({ message: 'Payload too large' }, { status: 413 });
    }

    const body = JSON.parse(text);
    await saveContent(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save content';
    const status = message.includes('JSON') ? 400 : 500;
    return NextResponse.json({ message }, { status });
  }
}
