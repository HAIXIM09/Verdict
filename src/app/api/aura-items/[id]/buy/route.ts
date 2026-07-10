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

    const alreadyOwned = await db.userAuraItem.findFirst({
      where: { userId: user.id, itemId: id },
    });
    if (alreadyOwned) {
      return NextResponse.json({ error: 'Already owned' }, { status: 400 });
    }

    if (user.coins < item.price) {
      return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });
    }

    await db.user.update({
      where: { id: user.id },
      data: { coins: { decrement: item.price } },
    });

    await db.userAuraItem.create({
      data: { userId: user.id, itemId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Buy item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}