/**
 * ============================================
 * ARTIVIO — PRODUCTS CONTROLLER
 * File: products.controller.ts
 * ============================================
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
} from '@nestjs/common';

import { ProductsService, ProductLabel, MaterialStatus } from './products.service';

/**
 * --------------------------------------------
 * NOTE:
 * companyId берется из request (JWT / middleware)
 * --------------------------------------------
 */

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * --------------------------------------------
   * GET ALL PRODUCTS (SITE / ADMIN)
   * --------------------------------------------
   */
  @Get()
  async list(@Req() req) {
    return this.productsService.list(req.companyId);
  }

  /**
   * --------------------------------------------
   * GET PRODUCT BY ID
   * --------------------------------------------
   */
  @Get(':id')
  async getById(@Param('id') id: string, @Req() req) {
    return this.productsService.getById(id, req.companyId);
  }

  /**
   * --------------------------------------------
   * CREATE PRODUCT (ADMIN)
   * --------------------------------------------
   */
  @Post()
  async create(@Req() req, @Body() body: {
    name: string;
    description?: string;
    price: number;
    costPrice: number;
    baseProductionDays: number;
    labels?: ProductLabel[];
  }) {
    return this.productsService.create(req.companyId, body);
  }

  /**
   * --------------------------------------------
   * UPDATE PRODUCT
   * --------------------------------------------
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() body,
  ) {
    return this.productsService.update(id, req.companyId, body);
  }

  /**
   * --------------------------------------------
   * SET PRODUCT LABELS
   * --------------------------------------------
   */
  @Put(':id/labels')
  async setLabels(
    @Param('id') id: string,
    @Req() req,
    @Body() body: { labels: ProductLabel[] },
  ) {
    return this.productsService.setLabels(id, req.companyId, body.labels);
  }

  /**
   * --------------------------------------------
   * UPSERT MATERIAL FOR PRODUCT
   * --------------------------------------------
   */
  @Put(':id/material')
  async upsertMaterial(
    @Param('id') id: string,
    @Req() req,
    @Body() body: {
      name: string;
      status: MaterialStatus;
      extraDays: number;
      avgConsumption: number;
    },
  ) {
    return this.productsService.upsertMaterial(id, req.companyId, body);
  }

  /**
   * --------------------------------------------
   * CALCULATE PRODUCTION DAYS
   * --------------------------------------------
   */
  @Get(':id/production-days')
  async productionDays(@Param('id') id: string) {
    return {
      days: await this.productsService.calculateProductionDays(id),
    };
  }
}

import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  list(@Req() req) {
    return this.service.list(req.saas.company.id);
  }

  @Post()
  create(@Req() req, @Body() body) {
    return this.service.create(req.saas.company.id, body);
  }
}