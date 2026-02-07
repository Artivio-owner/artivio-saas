/**
 * ============================================
 * ARTIVIO — ORDERS CONTROLLER
 * File: orders.controller.ts
 * ============================================
 */

import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
} from '@nestjs/common';

import { OrdersService, OrderStatus } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * --------------------------------------------
   * CREATE ORDER (SITE / ADMIN)
   * --------------------------------------------
   */
  @Post()
  async createOrder(
    @Body() body: {
      companyId: string;
      clientId: string;
      items: {
        productId: string;
        quantity: number;
        vip?: boolean;
      }[];
      deliveryType: 'DELIVERY' | 'PICKUP';
      comment?: string;
    },
  ) {
    return this.ordersService.createOrder(body.companyId, body);
  }

  /**
   * --------------------------------------------
   * ACCEPT ORDER (ADMIN)
   * --------------------------------------------
   */
  @Patch(':id/accept')
  async acceptOrder(
    @Param('id') orderId: string,
    @Body() body: { companyId: string },
  ) {
    return this.ordersService.acceptOrder(orderId, body.companyId);
  }

  /**
   * --------------------------------------------
   * UPDATE ORDER ITEM STATUS (PRODUCTION)
   * --------------------------------------------
   */
  @Patch('items/:itemId/status')
  async updateItemStatus(
    @Param('itemId') itemId: string,
    @Body() body: { status: OrderStatus },
  ) {
    return this.ordersService.updateItemStatus(itemId, body.status);
  }
}