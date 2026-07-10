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
    const { content, side } = await req.json();

    if (!content || !side || !['a', 'b'].includes(side)) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const battle = await db.battle.findUnique({ where: { id } });
    if (!battle) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
    }

    if (battle.status !== 'active') {
      return NextResponse.json({ error: 'Battle is not active' }, { status: 400 });
    }

    if (battle.creatorId !== user.id && battle.opponentId !== user.id) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
    }

    const message = await db.battleMessage.create({
      data: {
        battleId: id,
        userId: user.id,
        content,
        side,
      },
      include: { user: { select: { id: true, username: true, avatar: true } } },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}