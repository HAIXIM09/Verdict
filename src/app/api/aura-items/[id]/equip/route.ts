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

    const item = await db.auraItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const ownership = await db.userAuraItem.findFirst({
      where: { userId: user.id, itemId: id },
    });
    if (!ownership) {
      return NextResponse.json({ error: 'Not owned' }, { status: 400 });
    }

    // Unequip other items of same type
    await db.userAuraItem.updateMany({
      where: { userId: user.id, item: { type: item.type } },
      data: { equipped: false },
    });

    // Equip this item
    await db.userAuraItem.update({
      where: { id: ownership.id },
      data: { equipped: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Equip item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}