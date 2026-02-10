/**
 * ============================================
 * ARTIVIO — LANDINGS CONTROLLER
 * ============================================
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LandingsController {
  static async list(req: Request, res: Response) {
    const landings = await prisma.landing.findMany({
      where: {
        companyId: req.saas?.company?.id ?? null,
      },
    });

    res.json(landings);
  }

  static async save(req: Request, res: Response) {
    const { key, language, content } = req.body;

    const landing = await prisma.landing.upsert({
      where: {
        key_language: { key, language },
      },
      update: { content },
      create: {
        key,
        language,
        content,
        companyId: req.saas?.company?.id ?? null,
      },
    });

    res.json(landing);
  }
}