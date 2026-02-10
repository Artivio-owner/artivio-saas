/**
 * ============================================
 * ARTIVIO — COMPANIES CONTROLLER
 * ============================================
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CompaniesController {
  static async list(req: Request, res: Response) {
    const companies = await prisma.company.findMany();
    res.json(companies);
  }

  static async create(req: Request, res: Response) {
    const { name, slug, domain } = req.body;

    const company = await prisma.company.create({
      data: { name, slug, domain },
    });

    res.json(company);
  }
}