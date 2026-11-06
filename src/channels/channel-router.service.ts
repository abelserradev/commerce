import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChannelRouterService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveMerchantBySlug(slug: string) {
    const merchant = await this.prisma.merchant.findUnique({ where: { slug } });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    return merchant;
  }

  async resolveMerchantByChannelExternalId(channel: ChannelType, externalId: string) {
    const link = await this.prisma.channelLink.findFirst({
      where: { channel, externalId, isActive: true },
    });
    if (!link) {
      throw new NotFoundException('Channel link not found');
    }
    return link.merchantId;
  }
}
