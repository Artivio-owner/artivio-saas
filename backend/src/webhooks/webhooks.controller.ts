/**
 * ============================================
 * ARTIVIO — WEBHOOK CONTROLLER
 * ============================================
 */

import {
  Controller,
  Post,
  Param,
  Body,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { validateOzonWebhook } from './validators/ozon.validator';
import { validateWbWebhook } from './validators/wb.validator';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly service: WebhooksService) {}

  @Post(':type')
  async handle(
    @Param('type') type: string,
    @Body() body: any,
    @Headers() headers: any,
  ) {
    if (type === 'ozon') {
      const valid = validateOzonWebhook(
        body,
        headers['x-signature'],
        process.env.OZON_WEBHOOK_SECRET!,
      );
      if (!valid) throw new ForbiddenException();
    }

    if (type === 'wb') {
      const valid = validateWbWebhook(
        headers['x-token'],
        process.env.WB_WEBHOOK_TOKEN!,
      );
      if (!valid) throw new ForbiddenException();
    }

    return this.service.handle(type, body.event, body.data);
  }
}