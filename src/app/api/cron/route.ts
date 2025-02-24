import { handleAutoReply } from '@/lib/Instagram';
import { NextResponse } from 'next/server';

export async function GET() {
    await handleAutoReply()
  return NextResponse.json({ ok: true });
}