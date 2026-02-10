import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MarketplacesService {
  list() {
    return prisma.marketplace.findMany();
  }

  create(data: { code: string; name: string }) {
    return prisma.marketplace.create({ data });
  }
}