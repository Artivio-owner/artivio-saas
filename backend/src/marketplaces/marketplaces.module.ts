import { Module } from '@nestjs/common';
import { MarketplacesService } from './marketplaces.service';

@Module({
  providers: [MarketplacesService],
  exports: [MarketplacesService],
})
export class MarketplacesModule {}