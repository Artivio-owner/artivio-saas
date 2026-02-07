/**
 * ============================================
 * ARTIVIO — CLIENTS SERVICE
 * File: clients.service.ts
 * ============================================
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum ClientAutoTag {
  NEW = 'new_client',
  VIP = 'vip_client',
}

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ============================================
   * СОЗДАНИЕ КЛИЕНТА (АВТО / ВРУЧНУЮ)
   * ============================================
   * Используется:
   * - при регистрации пользователя
   * - при ручном добавлении администратором
   */
  async createClient(data: {
    companyId: string;
    name: string;
    phone?: string;
    email?: string;
    createdByAdmin?: boolean;
  }) {
    return this.prisma.client.create({
      data: {
        companyId: data.companyId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        autoTags: [ClientAutoTag.NEW],
        createdByAdmin: data.createdByAdmin ?? false,
      },
    });
  }

  /**
   * ============================================
   * ПОЛУЧЕНИЕ КЛИЕНТА ПО ID
   * ============================================
   */
  async getClientById(companyId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: {
        id: clientId,
        companyId,
      },
      include: {
        orders: true,
      },
    });

    if (!client) {
      throw new NotFoundException('Клиент не найден');
    }

    return client;
  }

  /**
   * ============================================
   * СПИСОК КЛИЕНТОВ КОМПАНИИ
   * ============================================
   */
  async getClients(companyId: string) {
    return this.prisma.client.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * ============================================
   * УПРАВЛЕНИЕ ВНУТРЕННИМИ МЕТКАМИ
   * ============================================
   * Метки видны только в админке
   */
  async setInternalTag(
    companyId: string,
    clientId: string,
    tag: string,
  ) {
    return this.prisma.client.updateMany({
      where: {
        id: clientId,
        companyId,
      },
      data: {
        internalTag: tag,
      },
    });
  }

  /**
   * ============================================
   * АВТОМАТИЧЕСКОЕ НАЗНАЧЕНИЕ VIP
   * ============================================
   * Вызывается при заказе с услугой VIP
   */
  async assignVipIfNeeded(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) return;

    if (!client.autoTags.includes(ClientAutoTag.VIP)) {
      await this.prisma.client.update({
        where: { id: clientId },
        data: {
          autoTags: {
            push: ClientAutoTag.VIP,
          },
        },
      });
    }
  }

  /**
   * ============================================
   * ИСТОРИЯ ЗАКАЗОВ КЛИЕНТА
   * ============================================
   */
  async getClientOrders(companyId: string, clientId: string) {
    return this.prisma.order.findMany({
      where: {
        companyId,
        clientId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}