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
exports.ConversationOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const catalog_service_1 = require("../catalog/catalog.service");
const orders_service_1 = require("../orders/orders.service");
const prisma_service_1 = require("../prisma/prisma.service");
const telegram_outbound_service_1 = require("../channels/outbound/telegram-outbound.service");
const whatsapp_outbound_service_1 = require("../channels/outbound/whatsapp-outbound.service");
let ConversationOrchestratorService = class ConversationOrchestratorService {
    prisma;
    catalog;
    orders;
    telegramOut;
    whatsappOut;
    constructor(prisma, catalog, orders, telegramOut, whatsappOut) {
        this.prisma = prisma;
        this.catalog = catalog;
        this.orders = orders;
        this.telegramOut = telegramOut;
        this.whatsappOut = whatsappOut;
    }
    async handleInbound(message) {
        const text = message.text.trim().toLowerCase();
        if (text === '/start' || text === 'hola' || text === 'menu') {
            return this.sendCatalog(message);
        }
        if (text.startsWith('add ')) {
            return this.addToCart(message, text.replace('add ', '').trim());
        }
        if (text === 'confirmar' || text === 'confirm') {
            return this.confirmCart(message);
        }
        if (text === 'carrito' || text === 'cart') {
            return this.describeCart(message);
        }
        return ('Comandos: menu · add <número> · carrito · confirmar\n' +
            'Ejemplo: add 1 (elige el número del producto en menu)');
    }
    async sendCatalog(message) {
        const products = await this.catalog.listPublishedForChat(message.merchantId);
        if (!products.length) {
            const reply = 'No hay productos publicados con stock.';
            await this.reply(message, reply);
            return reply;
        }
        const lines = products.map((p, i) => `${i + 1}. ${p.name} — ${p.priceAmount} ${p.currency} (stock ${p.stockQty})`);
        const reply = ['Catálogo:', ...lines, '', 'Escribe: add <número>'].join('\n');
        await this.reply(message, reply);
        return reply;
    }
    async addToCart(message, indexRaw) {
        const index = Number.parseInt(indexRaw, 10);
        if (!Number.isFinite(index) || index < 1) {
            const reply = 'Índice inválido. Usa menu y luego add 1, add 2, ...';
            await this.reply(message, reply);
            return reply;
        }
        const products = await this.catalog.listPublishedForChat(message.merchantId);
        const product = products[index - 1];
        if (!product) {
            const reply = 'Producto no encontrado en el catálogo.';
            await this.reply(message, reply);
            return reply;
        }
        const cart = await this.loadCart(message);
        const existing = cart.lines.find((l) => l.productId === product.id);
        if (existing) {
            existing.quantity += 1;
        }
        else {
            cart.lines.push({ productId: product.id, quantity: 1 });
        }
        await this.saveCart(message, cart);
        const reply = `Agregado: ${product.name}. Escribe carrito o confirmar.`;
        await this.reply(message, reply);
        return reply;
    }
    async describeCart(message) {
        const cart = await this.loadCart(message);
        if (!cart.lines.length) {
            const reply = 'Carrito vacío. Escribe menu.';
            await this.reply(message, reply);
            return reply;
        }
        const reply = `Carrito: ${cart.lines.length} línea(s). Escribe confirmar para pedir.`;
        await this.reply(message, reply);
        return reply;
    }
    async confirmCart(message) {
        const cart = await this.loadCart(message);
        if (!cart.lines.length) {
            const reply = 'Carrito vacío.';
            await this.reply(message, reply);
            return reply;
        }
        const idempotencyKey = `${message.channel}:${message.externalChatId}:${message.externalMessageId}`;
        const order = await this.orders.confirmFromCart({
            merchantId: message.merchantId,
            channel: message.channel,
            externalChatId: message.externalChatId,
            customerLabel: message.customerLabel,
            lines: cart.lines,
            idempotencyKey,
        });
        await this.saveCart(message, { lines: [] });
        const reply = `Pedido confirmado #${order.id.slice(0, 8)}. Gracias por tu compra.`;
        await this.reply(message, reply);
        return reply;
    }
    async loadCart(message) {
        const session = await this.prisma.conversationSession.findUnique({
            where: {
                merchantId_channel_externalChatId: {
                    merchantId: message.merchantId,
                    channel: message.channel,
                    externalChatId: message.externalChatId,
                },
            },
        });
        if (!session?.cartJson || typeof session.cartJson !== 'object') {
            return { lines: [] };
        }
        const raw = session.cartJson;
        return { lines: Array.isArray(raw.lines) ? raw.lines : [] };
    }
    async saveCart(message, cart) {
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
        await this.prisma.conversationSession.upsert({
            where: {
                merchantId_channel_externalChatId: {
                    merchantId: message.merchantId,
                    channel: message.channel,
                    externalChatId: message.externalChatId,
                },
            },
            create: {
                merchantId: message.merchantId,
                channel: message.channel,
                externalChatId: message.externalChatId,
                cartJson: cart,
                expiresAt,
            },
            update: { cartJson: cart, expiresAt },
        });
    }
    async reply(message, text) {
        if (message.channel === client_1.ChannelType.telegram) {
            await this.telegramOut.sendText(message.externalChatId, text);
            return;
        }
        await this.whatsappOut.sendText(message.externalChatId, text);
    }
};
exports.ConversationOrchestratorService = ConversationOrchestratorService;
exports.ConversationOrchestratorService = ConversationOrchestratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        catalog_service_1.CatalogService,
        orders_service_1.OrdersService,
        telegram_outbound_service_1.TelegramOutboundService,
        whatsapp_outbound_service_1.WhatsAppOutboundService])
], ConversationOrchestratorService);
//# sourceMappingURL=conversation-orchestrator.service.js.map