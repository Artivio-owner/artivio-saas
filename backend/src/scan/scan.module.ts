/**
 * ============================================
 * ARTIVIO — SCAN MODULE
 * ============================================
 */

import { Module } from '@nestjs/common';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ScanController],
  providers: [ScanService, PrismaService],
})
export class ScanModule {}