"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let CatalogService = class CatalogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listForMerchant(merchantId) {
        return this.prisma.product.findMany({
            where: { merchantId },
            orderBy: { name: 'asc' },
        });
    }
    listPublishedForChat(merchantId) {
        return this.prisma.product.findMany({
            where: { merchantId, isPublished: true, stockQty: { gt: 0 } },
            orderBy: { name: 'asc' },
        });
    }
    async create(merchantId, dto) {
        return this.prisma.product.create({
            data: {
                merchantId,
                name: dto.name,
                description: dto.description ?? '',
                priceAmount: new client_1.Prisma.Decimal(dto.priceAmount),
                currency: dto.currency ?? 'USD',
                stockQty: dto.stockQty,
                isPublished: dto.isPublished ?? true,
            },
        });
    }
    async update(merchantId, productId, dto) {
        await this.assertOwned(merchantId, productId);
        return this.prisma.product.update({
            where: { id: productId },
            data: {
                ...(dto.name != null ? { name: dto.name } : {}),
                ...(dto.description != null ? { description: dto.description } : {}),
                ...(dto.priceAmount != null ? { priceAmount: new client_1.Prisma.Decimal(dto.priceAmount) } : {}),
                ...(dto.currency != null ? { currency: dto.currency } : {}),
                ...(dto.stockQty != null ? { stockQty: dto.stockQty } : {}),
                ...(dto.isPublished != null ? { isPublished: dto.isPublished } : {}),
            },
        });
    }
    async remove(merchantId, productId) {
        await this.assertOwned(merchantId, productId);
        return this.prisma.product.update({
            where: { id: productId },
            data: { isPublished: false },
        });
    }
    async assertOwned(merchantId, productId) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId, merchantId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map