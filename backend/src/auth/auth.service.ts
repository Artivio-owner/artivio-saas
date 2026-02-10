/**
 * ============================================
 * ARTIVIO — AUTH SERVICE
 * ============================================
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';
import { JwtPayload } from './auth.types';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid password');

    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return { token, user };
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  }

  static async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}