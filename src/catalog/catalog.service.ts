import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  listForMerchant(merchantId: string) {
    return this.prisma.product.findMany({
      where: { merchantId },
      orderBy: { name: 'asc' },
    });
  }

  listPublishedForChat(merchantId: string) {
    return this.prisma.product.findMany({
      where: { merchantId, isPublished: true, stockQty: { gt: 0 } },
      orderBy: { name: 'asc' },
    });
  }

  async create(merchantId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        merchantId,
        name: dto.name,
        description: dto.description ?? '',
        priceAmount: new Prisma.Decimal(dto.priceAmount),
        currency: dto.currency ?? 'USD',
        stockQty: dto.stockQty,
        isPublished: dto.isPublished ?? true,
      },
    });
  }

  async update(merchantId: string, productId: string, dto: UpdateProductDto) {
    await this.assertOwned(merchantId, productId);
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        ...(dto.name != null ? { name: dto.name } : {}),
        ...(dto.description != null ? { description: dto.description } : {}),
        ...(dto.priceAmount != null ? { priceAmount: new Prisma.Decimal(dto.priceAmount) } : {}),
        ...(dto.currency != null ? { currency: dto.currency } : {}),
        ...(dto.stockQty != null ? { stockQty: dto.stockQty } : {}),
        ...(dto.isPublished != null ? { isPublished: dto.isPublished } : {}),
      },
    });
  }

  async remove(merchantId: string, productId: string) {
    await this.assertOwned(merchantId, productId);
    return this.prisma.product.update({
      where: { id: productId },
      data: { isPublished: false },
    });
  }

  private async assertOwned(merchantId: string, productId: string): Promise<void> {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, merchantId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  }
}
