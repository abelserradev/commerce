import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtMerchantPayload } from '../common/types/jwt-payload.type';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@CurrentUser() user: JwtMerchantPayload, @Query('status') status?: OrderStatus) {
    return this.orders.listForMerchant(user.merchantId, status);
  }

  @Get(':id')
  getOne(@CurrentUser() user: JwtMerchantPayload, @Param('id') id: string) {
    return this.orders.getForMerchant(user.merchantId, id);
  }
}
