import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

const VERDICTS = [
  "The arguments were 🔥 but in the end, only one side could survive the crucible. The loser's takes were weaker than wet paper — the winner made their case with the energy of a thousand suns.",
  "This debate had more twists than a thriller movie. Both sides came swinging, but one side clearly had the sharper blade. The loser might want to reconsider their life choices.",
  "The AI Judge has spoken! One side delivered facts so clean they could cut glass. The other side... well, they tried their best. A classic battle of substance vs. vibes.",
  "What a showdown! The winner brought receipts, logic, and a side of pure roasting energy. The loser's arguments crumbled like a cookie in milk. Case closed!",
  "This wasn't even close. The winner dominated with arguments so good, the AI Judge almost felt bad for the other side. Almost. Justice has been served.",
];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const battle = await db.battle.findUnique({
      where: { id },
      include: {
        creator: true,
        opponent: true,
        messages: true,
      },
    });

    if (!battle) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
    }

    if (battle.status !== 'active') {
      return NextResponse.json({ error: 'Battle is not active' }, { status: 400 });
    }

    if (battle.creatorId !== user.id && battle.opponentId !== user.id) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
    }

    if (battle.messages.length < 2) {
      return NextResponse.json({ error: 'Need at least 2 messages before judging' }, { status: 400 });
    }

    const sideAMessages = battle.messages.filter(m => m.side === 'a').length;
    const sideBMessages = battle.messages.filter(m => m.side === 'b').length;

    let winnerId: string;
    const rand = Math.random();

    if (sideAMessages === 0 && sideBMessages === 0) {
      winnerId = rand < 0.5 ? battle.creatorId : (battle.opponentId || battle.creatorId);
    } else if (sideAMessages === 0) {
      winnerId = battle.opponentId || battle.creatorId;
    } else if (sideBMessages === 0) {
      winnerId = battle.creatorId;
    } else {
      const total = sideAMessages + sideBMessages;
      const sideAWeight = (sideAMessages / total) * 0.6 + (rand > 0.5 ? 0.2 : 0);
      winnerId = sideAWeight >= 0.5 ? battle.creatorId : (battle.opponentId || battle.creatorId);
    }

    const loserId = winnerId === battle.creatorId ? (battle.opponentId || battle.creatorId) : battle.creatorId;
    const auraReward = battle.auraStake * 2;
    const coinReward = 50 + Math.floor(Math.random() * 100);

    const verdict = VERDICTS[Math.floor(Math.random() * VERDICTS.length)];

    const updated = await db.battle.update({
      where: { id },
      data: {
        status: 'judged',
        winnerId,
        aiVerdict: verdict,
      },
      include: {
        creator: { select: { id: true, username: true, avatar: true } },
        opponent: { select: { id: true, username: true, avatar: true } },
        winner: { select: { id: true, username: true, avatar: true } },
      },
    });

    await db.user.update({
      where: { id: winnerId },
      data: {
        aura: { increment: auraReward },
        coins: { increment: coinReward },
        wins: { increment: 1 },
        streak: { increment: 1 },
      },
    });

    await db.user.update({
      where: { id: loserId },
      data: {
        losses: { increment: 1 },
        streak: 0,
      },
    });

    return NextResponse.json({
      battle: updated,
      verdict,
      auraReward,
      coinReward,
    });
  } catch (error) {
    console.error('Judge error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}