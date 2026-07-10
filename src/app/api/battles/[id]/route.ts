import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const battle = await db.battle.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, username: true, avatar: true, aura: true } },
        opponent: { select: { id: true, username: true, avatar: true, aura: true } },
        winner: { select: { id: true, username: true, avatar: true } },
        messages: {
          include: { user: { select: { id: true, username: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!battle) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
    }

    return NextResponse.json({ battle });
  } catch (error) {
    console.error('Get battle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}