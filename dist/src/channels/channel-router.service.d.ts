import { ChannelType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class ChannelRouterService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resolveMerchantBySlug(slug: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
    }>;
    resolveMerchantByChannelExternalId(channel: ChannelType, externalId: string): Promise<string>;
}
