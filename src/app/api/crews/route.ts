import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const crews = await db.crew.findMany({
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ crews });
  } catch (error) {
    console.error('Get crews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}