/**
 * ============================================
 * ARTIVIO — ORDERS CONTROLLER
 * File: orders.controller.ts
 * ============================================
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { OrdersService, OrderStatus } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard, UserRole } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * --------------------------------------------
   * LIST ORDERS
   * --------------------------------------------
   * Admin / Manager / Master
   */
  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.MASTER,
  )
  async list(@Req() req: Request) {
    return this.ordersService.listOrders(req.user.companyId);
  }

  /**
   * --------------------------------------------
   * CREATE ORDER (ADMIN / MANAGER)
   * --------------------------------------------
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async create(
    @Req() req: Request,
    @Body()
    body: {
      clientId: string;
      items: { productId: string; quantity: number }[];
      isVip?: boolean;
    },
  ) {
    return this.ordersService.createOrder({
      companyId: req.user.companyId,
      clientId: body.clientId,
      items: body.items,
      isVip: body.isVip,
      createdByRole: req.user.role,
    });
  }

  /**
   * --------------------------------------------
   * ACCEPT ORDER
   * --------------------------------------------
   * Admin / Manager
   */
  @Patch(':id/accept')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async accept(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('productionDays') productionDays?: number,
  ) {
    return this.ordersService.acceptOrder(
      id,
      req.user.companyId,
      productionDays,
    );
  }

  /**
   * --------------------------------------------
   * UPDATE ITEM STATUS (PRODUCTION LINE)
   * --------------------------------------------
   * Admin / Master
   */
  @Patch('item/:itemId/status')
  @Roles(UserRole.ADMIN, UserRole.MASTER)
  async updateItemStatus(
    @Req() req: Request,
    @Param('itemId') itemId: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateItemStatus(
      itemId,
      status,
      req.user.companyId,
    );
  }

  /**
   * --------------------------------------------
   * COMPLETE ORDER
   * --------------------------------------------
   * Admin
   */
  @Patch(':id/complete')
  @Roles(UserRole.ADMIN)
  async complete(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    return this.ordersService.completeOrder(
      id,
      req.user.companyId,
    );
  }
}