import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
export declare class CatalogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listForMerchant(merchantId: string): Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        description: string;
        priceAmount: Prisma.Decimal;
        currency: string;
        stockQty: number;
        isPublished: boolean;
    }[]>;
    listPublishedForChat(merchantId: string): Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        description: string;
        priceAmount: Prisma.Decimal;
        currency: string;
        stockQty: number;
        isPublished: boolean;
    }[]>;
    create(merchantId: string, dto: CreateProductDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        description: string;
        priceAmount: Prisma.Decimal;
        currency: string;
        stockQty: number;
        isPublished: boolean;
    }>;
    update(merchantId: string, productId: string, dto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        description: string;
        priceAmount: Prisma.Decimal;
        currency: string;
        stockQty: number;
        isPublished: boolean;
    }>;
    remove(merchantId: string, productId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        description: string;
        priceAmount: Prisma.Decimal;
        currency: string;
        stockQty: number;
        isPublished: boolean;
    }>;
    private assertOwned;
}
