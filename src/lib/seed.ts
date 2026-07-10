import { PrismaClient } from '@prisma/client';

const db = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function seed() {
  console.log('🌱 Seeding aura items...');

  const items = [
    { name: 'Neon Frame', type: 'frame', rarity: 'common', price: 50, icon: '🟪' },
    { name: 'Pixel Frame', type: 'frame', rarity: 'common', price: 75, icon: '👾' },
    { name: 'Void Walker', type: 'frame', rarity: 'rare', price: 150, icon: '🌀' },
    { name: 'Certified Menace', type: 'title', rarity: 'rare', price: 200, icon: '💀' },
    { name: 'Target Lock', type: 'badge', rarity: 'rare', price: 150, icon: '🎯' },
    { name: 'Shockwave Effect', type: 'effect', rarity: 'rare', price: 200, icon: '⚡' },
    { name: 'Aura Lord', type: 'title', rarity: 'epic', price: 300, icon: '👑' },
    { name: 'Glitch Effect', type: 'effect', rarity: 'epic', price: 350, icon: '📺' },
    { name: 'Flame Crown', type: 'badge', rarity: 'legendary', price: 400, icon: '🔥' },
    { name: 'Halo Aura', type: 'effect', rarity: 'legendary', price: 450, icon: '✨' },
    { name: 'Zenith Title', type: 'title', rarity: 'legendary', price: 500, icon: '🏆' },
    { name: 'Spark Badge', type: 'badge', rarity: 'common', price: 50, icon: '⭐' },
  ];

  for (const item of items) {
    await db.auraItem.upsert({
      where: { id: `${item.type}-${item.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `${item.type}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...item,
      },
    });
  }

  console.log(`✅ Seeded ${items.length} aura items`);
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect());