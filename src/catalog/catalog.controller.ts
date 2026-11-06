import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtMerchantPayload } from '../common/types/jwt-payload.type';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  list(@CurrentUser() user: JwtMerchantPayload) {
    return this.catalog.listForMerchant(user.merchantId);
  }

  @Post()
  create(@CurrentUser() user: JwtMerchantPayload, @Body() dto: CreateProductDto) {
    return this.catalog.create(user.merchantId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtMerchantPayload,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.catalog.update(user.merchantId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtMerchantPayload, @Param('id') id: string) {
    return this.catalog.remove(user.merchantId, id);
  }
}
