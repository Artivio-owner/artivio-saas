/**
 * ============================================
 * ARTIVIO — ORDERS CONTROLLER
 * ============================================
 */

import { Controller, Post, Get, Body, Req, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TenantRequest } from '../domains/tenant.middleware';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req: TenantRequest, @Body() body: any) {
    return this.ordersService.createOrder({
      companyId: req.companyId!,
      warehouseId: body.warehouseId,
      items: body.items,
      marketplace: body.marketplace,
      isPickup: body.isPickup,
    });
  }

  @Post(':id/pay')
  pay(@Param('id') id: string) {
    return this.ordersService.markPaid(id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }

  @Get()
  list(@Req() req: TenantRequest) {
    return this.ordersService.list(req.companyId!);
  }
}

/**
 * ============================================
 * ORDERS CONTROLLER
 * ============================================
 */

import { Request, Response } from 'express';
import { OrdersService } from './orders.service';

export class OrdersController {
  static async list(req: Request, res: Response) {
    const companyId = req.saas?.company?.id!;
    const orders = await OrdersService.list(companyId);
    res.json(orders);
  }

  static async create(req: Request, res: Response) {
    const companyId = req.saas?.company?.id!;
    const order = await OrdersService.create(companyId, req.body);
    res.json(order);
  }
}