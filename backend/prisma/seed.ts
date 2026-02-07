/**
 * ============================================
 * ARTIVIO — PRISMA SEED
 * File: seed.ts
 * ============================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Запуск seed для Artivio...');

  /**
   * --------------------------------------------------
   * 1. СОЗДАНИЕ КОМПАНИИ ARTIVIO
   * --------------------------------------------------
   */
  const artivio = await prisma.company.upsert({
    where: {
      name: 'Artivio',
    },
    update: {},
    create: {
      name: 'Artivio',
      domain: 'artivio.ru',
      tariff: 'FREE',
      isActive: true,
    },
  });

  console.log('✅ Компания создана:', artivio.name);

  /**
   * --------------------------------------------------
   * 2. СТАРТОВЫЕ ПРОДУКТЫ (ПРИМЕРЫ)
   * --------------------------------------------------
   * Можно удалить позже — нужны для тестирования
   */
  await prisma.product.createMany({
    data: [
      {
        companyId: artivio.id,
        name: 'Дизайнерский стол Artivio',
        description: 'Премиальный стол с авторским дизайном',
        price: 120000,
        costPrice: 60000,
        labels: ['Хит', 'Премиум'],
      },
      {
        companyId: artivio.id,
        name: 'Детский стеллаж Artivio',
        description: 'Экологичная мебель для детской',
        price: 45000,
        costPrice: 22000,
        labels: ['Экологично'],
      },
    ],
  });

  console.log('✅ Тестовые товары добавлены');

  /**
   * --------------------------------------------------
   * 3. СТАРТОВЫЕ РАСХОДЫ (ПРИМЕР)
   * --------------------------------------------------
   */
  await prisma.expense.create({
    data: {
      companyId: artivio.id,
      title: 'Аренда мастерской',
      amount: 80000,
      date: new Date(),
    },
  });

  console.log('✅ Тестовый расход добавлен');

  console.log('🎉 Seed успешно завершён');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });