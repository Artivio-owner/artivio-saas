/**
 * ============================================
 * ARTIVIO — MATERIALS CONTROLLER
 * File: materials.controller.ts
 * ============================================
 */

import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
} from '@nestjs/common';

import { MaterialsService } from './materials.service';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  /**
   * --------------------------------------------
   * CREATE MATERIAL (ADMIN)
   * --------------------------------------------
   */
  @Post()
  async createMaterial(
    @Body() body: {
      companyId: string;
      name: string;
      type: string;
      quantity: number;
      criticalQuantity: number;
      extraDays: number;
    },
  ) {
    return this.materialsService.createMaterial(body.companyId, body);
  }

  /**
   * --------------------------------------------
   * GET MATERIAL STATUS
   * --------------------------------------------
   */
  @Get(':id/status')
  async getMaterialStatus(@Param('id') materialId: string) {
    return this.materialsService.getMaterialStatus(materialId);
  }

  /**
   * --------------------------------------------
   * CHECK CRITICAL STOCK
   * --------------------------------------------
   */
  @Get('company/:companyId/critical')
  async getCriticalStock(@Param('companyId') companyId: string) {
    return this.materialsService.checkCriticalStock(companyId);
  }

  /**
   * --------------------------------------------
   * MANUAL UPDATE MATERIAL QUANTITY
   * --------------------------------------------
   */
  @Patch(':id/quantity')
  async updateQuantity(
    @Param('id') materialId: string,
    @Body() body: { quantity: number },
  ) {
    return this.materialsService['prisma'].material.update({
      where: { id: materialId },
      data: { quantity: body.quantity },
    });
  }
}