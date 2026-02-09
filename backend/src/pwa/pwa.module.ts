/**
 * ============================================
 * ARTIVIO — PWA MODULE
 * ============================================
 */

import { Module } from '@nestjs/common';
import { PwaController } from './pwa.controller';

@Module({
  controllers: [PwaController],
})
export class PwaModule {}