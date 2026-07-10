import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    const items = await db.auraItem.findMany({ orderBy: { price: 'asc' } });

    const ownedItems = user
      ? await db.userAuraItem.findMany({
          where: { userId: user.id },
          select: { itemId: true, equipped: true },
        })
      : [];

    const ownedSet = new Set(ownedItems.map(oi => oi.itemId));
    const equippedSet = new Set(ownedItems.filter(oi => oi.equipped).map(oi => oi.itemId));

    const itemsWithOwnership = items.map(item => ({
      ...item,
      owned: ownedSet.has(item.id),
      equipped: equippedSet.has(item.id),
    }));

    return NextResponse.json({ items: itemsWithOwnership });
  } catch (error) {
    console.error('Get aura items error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}