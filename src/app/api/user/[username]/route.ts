import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;

    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        avatar: true,
        aura: true,
        wins: true,
        losses: true,
        streak: true,
        rank: true,
        createdAt: true,
        _count: {
          select: {
            createdBattles: true,
            opponentBattles: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalBattles = user._count.createdBattles + user._count.opponentBattles;

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        aura: user.aura,
        wins: user.wins,
        losses: user.losses,
        streak: user.streak,
        rank: user.rank,
        createdAt: user.createdAt,
        totalBattles,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}