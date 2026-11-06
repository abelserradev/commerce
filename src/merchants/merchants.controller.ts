import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtMerchantPayload } from '../common/types/jwt-payload.type';
import { MerchantsService } from './merchants.service';

@Controller('merchants')
@UseGuards(JwtAuthGuard)
export class MerchantsController {
  constructor(private readonly merchants: MerchantsService) {}

  @Get('me')
  getMe(@CurrentUser() user: JwtMerchantPayload) {
    return this.merchants.getById(user.merchantId);
  }
}
