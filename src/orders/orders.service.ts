import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ChannelType, OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CartLineInput {
  productId: string;
  quantity: number;
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  listForMerchant(merchantId: string, status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: { merchantId, ...(status ? { status } : {}) },
      include: { lines: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  getForMerchant(merchantId: string, orderId: string) {
    return this.prisma.order.findFirst({
      where: { id: orderId, merchantId },
      include: { lines: { include: { product: true } } },
    });
  }

  async confirmFromCart(params: {
    merchantId: string;
    channel: ChannelType;
    externalChatId: string;
    customerLabel: string;
    lines: CartLineInput[];
    idempotencyKey: string;
  }) {
    const existing = await this.prisma.order.findUnique({
      where: { idempotencyKey: params.idempotencyKey },
      include: { lines: true },
    });
    if (existing?.status === OrderStatus.confirmed) {
      return existing;
    }
    if (!params.lines.length) {
      throw new BadRequestException('Cart is empty');
    }
    return this.prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          merchantId: params.merchantId,
          id: { in: params.lines.map((l) => l.productId) },
          isPublished: true,
        },
      });
      const productMap = new Map(products.map((p) => [p.id, p]));
      let totalLines: Prisma.OrderLineCreateWithoutOrderInput[] = [];
      for (const line of params.lines) {
        const product = productMap.get(line.productId);
        if (!product) {
          throw new BadRequestException(`Product ${line.productId} unavailable`);
        }
        if (product.stockQty < line.quantity) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }
        const unitPrice = product.priceAmount;
        const lineTotal = unitPrice.mul(line.quantity);
        totalLines.push({
          product: { connect: { id: product.id } },
          quantity: line.quantity,
          unitPrice,
          lineTotal,
        });
      }
      const order = await tx.order.create({
        data: {
          merchantId: params.merchantId,
          status: OrderStatus.confirmed,
          channel: params.channel,
          externalChatId: params.externalChatId,
          customerLabel: params.customerLabel,
          idempotencyKey: params.idempotencyKey,
          confirmedAt: new Date(),
          lines: { create: totalLines },
        },
        include: { lines: true },
      });
      for (const line of params.lines) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stockQty: { decrement: line.quantity } },
        });
      }
      return order;
    });
  }
}
