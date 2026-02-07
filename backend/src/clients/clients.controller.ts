/**
 * ============================================
 * ARTIVIO — CLIENTS CONTROLLER
 * File: clients.controller.ts
 * ============================================
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common';

import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /**
   * --------------------------------------------------
   * СПИСОК КЛИЕНТОВ КОМПАНИИ
   * --------------------------------------------------
   */
  @Get(':companyId')
  async getClients(
    @Param('companyId') companyId: string,
  ) {
    return this.clientsService.getClients(companyId);
  }

  /**
   * --------------------------------------------------
   * КАРТОЧКА КЛИЕНТА
   * --------------------------------------------------
   */
  @Get(':companyId/:clientId')
  async getClient(
    @Param('companyId') companyId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.clientsService.getClientById(companyId, clientId);
  }

  /**
   * --------------------------------------------------
   * РУЧНОЕ ДОБАВЛЕНИЕ КЛИЕНТА
   * --------------------------------------------------
   */
  @Post(':companyId')
  async createClient(
    @Param('companyId') companyId: string,
    @Body()
    body: {
      name: string;
      phone?: string;
      email?: string;
    },
  ) {
    return this.clientsService.createClient({
      companyId,
      name: body.name,
      phone: body.phone,
      email: body.email,
      createdByAdmin: true,
    });
  }

  /**
   * --------------------------------------------------
   * УСТАНОВКА ВНУТРЕННЕЙ МЕТКИ
   * --------------------------------------------------
   */
  @Patch(':companyId/:clientId/tag')
  async setInternalTag(
    @Param('companyId') companyId: string,
    @Param('clientId') clientId: string,
    @Body()
    body: {
      tag: string;
    },
  ) {
    return this.clientsService.setInternalTag(
      companyId,
      clientId,
      body.tag,
    );
  }

  /**
   * --------------------------------------------------
   * ИСТОРИЯ ЗАКАЗОВ КЛИЕНТА
   * --------------------------------------------------
   */
  @Get(':companyId/:clientId/orders')
  async getClientOrders(
    @Param('companyId') companyId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.clientsService.getClientOrders(companyId, clientId);
  }
}