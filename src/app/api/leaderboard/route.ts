import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { aura: 'desc' },
      take: 20,
      select: {
        id: true,
        username: true,
        avatar: true,
        aura: true,
        wins: true,
        losses: true,
        streak: true,
        rank: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}