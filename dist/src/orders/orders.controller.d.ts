import { OrderStatus } from '@prisma/client';
import type { JwtMerchantPayload } from '../common/types/jwt-payload.type';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly orders;
    constructor(orders: OrdersService);
    list(user: JwtMerchantPayload, status?: OrderStatus): import("@prisma/client").Prisma.PrismaPromise<({
        lines: ({
            product: {
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
            };
        } & {
            id: string;
            quantity: number;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            lineTotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        customerLabel: string;
        customerPhone: string | null;
        channel: import("@prisma/client").$Enums.ChannelType;
        externalChatId: string;
        idempotencyKey: string | null;
        confirmedAt: Date | null;
    })[]>;
    getOne(user: JwtMerchantPayload, id: string): import("@prisma/client").Prisma.Prisma__OrderClient<({
        lines: ({
            product: {
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
            };
        } & {
            id: string;
            quantity: number;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            lineTotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        customerLabel: string;
        customerPhone: string | null;
        channel: import("@prisma/client").$Enums.ChannelType;
        externalChatId: string;
        idempotencyKey: string | null;
        confirmedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
