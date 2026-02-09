/**
 * ============================================
 * ARTIVIO — PRISMA SEED
 * ============================================
 */

import { PrismaClient, SaasPlan } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.create({
    data: {
      name: 'Demo Company',
      plan: SaasPlan.FREE,
      users: {
        create: {
          email: 'admin@demo.local',
        },
      },
      warehouses: {
        create: {
          name: 'Main Warehouse',
        },
      },
    },
  });

  console.log('Seeded company:', company.name);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());