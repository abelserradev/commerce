import type { JwtMerchantPayload } from '../common/types/jwt-payload.type';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class CatalogController {
    private readonly catalog;
    constructor(catalog: CatalogService);
    list(user: JwtMerchantPayload): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        description: string;
        priceAmount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        stockQty: number;
        isPublished: boolean;
    }[]>;
    create(user: JwtMerchantPayload, dto: CreateProductDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        description: string;
        priceAmount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        stockQty: number;
        isPublished: boolean;
    }>;
    update(user: JwtMerchantPayload, id: string, dto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        description: string;
        priceAmount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        stockQty: number;
        isPublished: boolean;
    }>;
    remove(user: JwtMerchantPayload, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        description: string;
        priceAmount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        stockQty: number;
        isPublished: boolean;
    }>;
}
