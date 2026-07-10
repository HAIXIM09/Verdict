import { cookies } from 'next/headers';
import { db } from './db';
import { jwtVerify } from 'jose';

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'verdict-secret-key-change-me')
    );
    const userId = (payload as { userId: string }).userId;
    return await db.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}