/**
 * ============================================
 * ARTIVIO — LANDINGS SERVICE
 * ============================================
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LandingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByKey(key: string) {
    const landing = await this.prisma.landing.findUnique({
      where: { key },
    });

    if (!landing) {
      throw new NotFoundException('Landing not found');
    }

    return landing;
  }
}