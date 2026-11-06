import { ChannelType, OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export interface CartLineInput {
    productId: string;
    quantity: number;
}
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listForMerchant(merchantId: string, status?: OrderStatus): Prisma.PrismaPromise<({
        lines: ({
            product: {
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
            };
        } & {
            id: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
    getForMerchant(merchantId: string, orderId: string): Prisma.Prisma__OrderClient<({
        lines: ({
            product: {
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
            };
        } & {
            id: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    confirmFromCart(params: {
        merchantId: string;
        channel: ChannelType;
        externalChatId: string;
        customerLabel: string;
        lines: CartLineInput[];
        idempotencyKey: string;
    }): Promise<{
        lines: {
            id: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
            productId: string;
            orderId: string;
        }[];
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
    }>;
}
