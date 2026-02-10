/**
 * ============================================
 * ARTIVIO — SCAN CONTROLLER
 * ============================================
 */

import { Controller, Post, Body } from '@nestjs/common';
import { ScanService } from './scan.service';
import { CompanyRoles } from '../rbac/rbac.decorator';
import { CompanyRole } from '../rbac/roles.enum';

@Controller('scan')
export class ScanController {
  constructor(private readonly service: ScanService) {}

  @Post('resolve')
  @CompanyRoles(
    CompanyRole.WAREHOUSE,
    CompanyRole.MANAGER,
    CompanyRole.ADMIN,
  )
  resolve(@Body('article') article: string) {
    return this.service.resolveByArticle(article);
  }

  @Post('order')
  @CompanyRoles(CompanyRole.WAREHOUSE)
  attach(
    @Body('orderId') orderId: string,
    @Body('article') article: string,
  ) {
    return this.service.attachToOrder(orderId, article);
  }
}