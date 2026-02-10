/**
 * ============================================
 * ARTIVIO — USERS CONTROLLER
 * ============================================
 */

import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { AuthService } from '../auth/auth.service';

const prisma = new PrismaClient();

export class UsersController {
  static async list(req: Request, res: Response) {
    const where = req.user?.role === Role.SUPER_ADMIN
      ? {}
      : { companyId: req.user?.companyId };

    const users = await prisma.user.findMany({ where });
    res.json(users);
  }

  static async create(req: Request, res: Response) {
    const { email, password, role, companyId } = req.body;

    const hashed = await AuthService.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role,
        companyId,
      },
    });

    res.json(user);
  }
}