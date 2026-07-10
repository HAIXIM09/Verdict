import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const battle = await db.battle.findUnique({ where: { id } });

    if (!battle) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
    }

    if (battle.status !== 'open') {
      return NextResponse.json({ error: 'Battle is not open' }, { status: 400 });
    }

    if (battle.creatorId === user.id) {
      return NextResponse.json({ error: 'Cannot join your own battle' }, { status: 400 });
    }

    if (user.aura < battle.auraStake) {
      return NextResponse.json({ error: 'Not enough aura' }, { status: 400 });
    }

    const updated = await db.battle.update({
      where: { id },
      data: { opponentId: user.id, status: 'active' },
      include: {
        creator: { select: { id: true, username: true, avatar: true } },
        opponent: { select: { id: true, username: true, avatar: true } },
      },
    });

    await db.user.update({
      where: { id: user.id },
      data: { aura: { decrement: battle.auraStake } },
    });

    return NextResponse.json({ battle: updated });
  } catch (error) {
    console.error('Join battle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}