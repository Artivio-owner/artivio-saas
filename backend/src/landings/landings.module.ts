/**
 * ============================================
 * ARTIVIO — LANDINGS MODULE
 * ============================================
 */

import { Module } from '@nestjs/common';
import { LandingsController } from './landings.controller';
import { LandingsService } from './landings.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LandingsController],
  providers: [LandingsService, PrismaService],
})
export class LandingsModule {}