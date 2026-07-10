import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [totalUsers, totalBattles, totalMessages] = await Promise.all([
      db.user.count(),
      db.battle.count(),
      db.battleMessage.count(),
    ]);

    return NextResponse.json({ totalUsers, totalBattles, totalMessages });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}