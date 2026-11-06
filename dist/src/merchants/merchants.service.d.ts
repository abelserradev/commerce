import { PrismaService } from '../prisma/prisma.service';
export declare class MerchantsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getById(merchantId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
    }>;
}
