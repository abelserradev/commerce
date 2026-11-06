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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramWebhookController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const channel_router_service_1 = require("../channel-router.service");
const conversation_orchestrator_service_1 = require("../../conversation/conversation-orchestrator.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let TelegramWebhookController = class TelegramWebhookController {
    router;
    orchestrator;
    prisma;
    constructor(router, orchestrator, prisma) {
        this.router = router;
        this.orchestrator = orchestrator;
        this.prisma = prisma;
    }
    async handle(merchantSlug, update) {
        const merchant = await this.router.resolveMerchantBySlug(merchantSlug);
        const msg = update.message;
        if (!msg?.text?.trim()) {
            return { ok: true };
        }
        const externalMessageId = String(msg.message_id);
        const dedupe = await this.prisma.webhookDedupe.findUnique({
            where: { source_messageId: { source: 'telegram', messageId: externalMessageId } },
        });
        if (dedupe) {
            return { ok: true, deduped: true };
        }
        await this.prisma.webhookDedupe.create({
            data: { source: 'telegram', messageId: externalMessageId },
        });
        const inbound = {
            channel: client_1.ChannelType.telegram,
            merchantId: merchant.id,
            externalChatId: String(msg.chat.id),
            externalMessageId,
            text: msg.text,
            customerLabel: msg.from?.first_name ?? msg.from?.username ?? 'Cliente',
        };
        await this.orchestrator.handleInbound(inbound);
        return { ok: true };
    }
};
exports.TelegramWebhookController = TelegramWebhookController;
__decorate([
    (0, common_1.Post)(':merchantSlug'),
    __param(0, (0, common_1.Param)('merchantSlug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelegramWebhookController.prototype, "handle", null);
exports.TelegramWebhookController = TelegramWebhookController = __decorate([
    (0, common_1.Controller)('webhooks/telegram'),
    __metadata("design:paramtypes", [channel_router_service_1.ChannelRouterService,
        conversation_orchestrator_service_1.ConversationOrchestratorService,
        prisma_service_1.PrismaService])
], TelegramWebhookController);
//# sourceMappingURL=telegram-webhook.controller.js.map