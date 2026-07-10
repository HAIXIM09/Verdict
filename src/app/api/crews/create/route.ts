import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    const crew = await db.crew.create({
      data: {
        name,
        description: description || null,
        memberId: user.id,
      },
    });

    await db.crewMember.create({
      data: {
        crewId: crew.id,
        userId: user.id,
        role: 'leader',
      },
    });

    return NextResponse.json({ crew }, { status: 201 });
  } catch (error) {
    console.error('Create crew error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}