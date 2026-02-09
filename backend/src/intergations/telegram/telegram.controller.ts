/**
 * ============================================
 * ARTIVIO — TELEGRAM CONTROLLER
 * ============================================
 */

import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('integrations/telegram')
export class TelegramController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('connect')
  async connectTelegram(
    @Body()
    body: {
      companyId: string;
      chatId: string;
    },
  ) {
    return this.prisma.telegramIntegration.upsert({
      where: {
        companyId: body.companyId,
      },
      update: {
        chatId: body.chatId,
        isActive: true,
      },
      create: {
        companyId: body.companyId,
        chatId: body.chatId,
        isActive: true,
      },
    });
  }
}