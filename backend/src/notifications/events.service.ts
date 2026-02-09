/**
 * ============================================
 * ARTIVIO — EVENTS BUS
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationPayload } from './notification.types';

@Injectable()
export class EventsService {
  constructor(private readonly notificationService: NotificationService) {}

  async emit(payload: NotificationPayload) {
    return this.notificationService.dispatch(payload);
  }
}