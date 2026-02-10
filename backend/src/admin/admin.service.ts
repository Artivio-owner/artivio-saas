/**
 * ============================================
 * ADMIN SERVICE
 * ============================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminService {
  // Companies
  getCompanies() {
    return prisma.company.findMany();
  }

  createCompany(data: { name: string; domain: string }) {
    return prisma.company.create({ data });
  }

  // Users
  getUsers() {
    return prisma.user.findMany();
  }

  // Landings (CMS)
  getLandings() {
    return prisma.landing.findMany();
  }

  saveLanding(data: {
    key: string;
    language: string;
    content: any;
  }) {
    return prisma.landing.upsert({
      where: {
        key_language: {
          key: data.key,
          language: data.language,
        },
      },
      update: { content: data.content },
      create: data,
    });
  }
}