import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic, category, sideA, sideB, auraStake } = await req.json();
    if (!topic || !category || !sideA || !sideB) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const stake = typeof auraStake === 'number' ? auraStake : 50;

    if (user.aura < stake) {
      return NextResponse.json({ error: 'Not enough aura' }, { status: 400 });
    }

    const battle = await db.battle.create({
      data: {
        topic,
        category,
        sideA,
        sideB,
        auraStake: stake,
        creatorId: user.id,
      },
      include: {
        creator: { select: { id: true, username: true, avatar: true } },
      },
    });

    await db.user.update({
      where: { id: user.id },
      data: { aura: { decrement: stake } },
    });

    return NextResponse.json({ battle }, { status: 201 });
  } catch (error) {
    console.error('Create battle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}