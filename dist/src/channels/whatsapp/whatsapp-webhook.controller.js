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
exports.WhatsAppWebhookController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const channel_router_service_1 = require("../channel-router.service");
const conversation_orchestrator_service_1 = require("../../conversation/conversation-orchestrator.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const whatsapp_signature_service_1 = require("./whatsapp-signature.service");
let WhatsAppWebhookController = class WhatsAppWebhookController {
    config;
    signatures;
    router;
    orchestrator;
    prisma;
    constructor(config, signatures, router, orchestrator, prisma) {
        this.config = config;
        this.signatures = signatures;
        this.router = router;
        this.orchestrator = orchestrator;
        this.prisma = prisma;
    }
    verify(mode, token, challenge) {
        const expected = this.config.get('WHATSAPP_VERIFY_TOKEN') ?? '';
        if (mode === 'subscribe' && token === expected) {
            return challenge;
        }
        throw new common_1.ForbiddenException();
    }
    async inbound(req, signature, body) {
        const raw = req.rawBody ?? Buffer.from(JSON.stringify(body));
        if (!this.signatures.verify(raw, signature)) {
            throw new common_1.ForbiddenException();
        }
        const entry = body.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;
        const phoneNumberId = value?.metadata?.phone_number_id;
        const messages = value?.messages ?? [];
        if (!phoneNumberId || !messages.length) {
            return { ok: true };
        }
        const merchantId = await this.router.resolveMerchantByChannelExternalId(client_1.ChannelType.whatsapp, phoneNumberId);
        for (const rawMsg of messages) {
            const msg = rawMsg;
            const messageId = String(msg.id ?? '');
            const textBody = msg.text?.body ?? '';
            const from = String(msg.from ?? '');
            if (!messageId || !textBody.trim()) {
                continue;
            }
            const dedupe = await this.prisma.webhookDedupe.findUnique({
                where: { source_messageId: { source: 'whatsapp', messageId } },
            });
            if (dedupe) {
                continue;
            }
            await this.prisma.webhookDedupe.create({ data: { source: 'whatsapp', messageId } });
            const inbound = {
                channel: client_1.ChannelType.whatsapp,
                merchantId,
                externalChatId: from,
                externalMessageId: messageId,
                text: textBody,
                customerLabel: from,
            };
            await this.orchestrator.handleInbound(inbound);
        }
        return { ok: true };
    }
};
exports.WhatsAppWebhookController = WhatsAppWebhookController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('hub.mode')),
    __param(1, (0, common_1.Query)('hub.verify_token')),
    __param(2, (0, common_1.Query)('hub.challenge')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", String)
], WhatsAppWebhookController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-hub-signature-256')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WhatsAppWebhookController.prototype, "inbound", null);
exports.WhatsAppWebhookController = WhatsAppWebhookController = __decorate([
    (0, common_1.Controller)('webhooks/whatsapp'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        whatsapp_signature_service_1.WhatsAppSignatureService,
        channel_router_service_1.ChannelRouterService,
        conversation_orchestrator_service_1.ConversationOrchestratorService,
        prisma_service_1.PrismaService])
], WhatsAppWebhookController);
//# sourceMappingURL=whatsapp-webhook.controller.js.map