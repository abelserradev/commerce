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
exports.WhatsAppSignatureService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
let WhatsAppSignatureService = class WhatsAppSignatureService {
    config;
    constructor(config) {
        this.config = config;
    }
    verify(rawBody, signatureHeader) {
        const secret = this.config.get('WHATSAPP_APP_SECRET');
        if (!secret || !signatureHeader?.startsWith('sha256=')) {
            return false;
        }
        const expected = (0, crypto_1.createHmac)('sha256', secret).update(rawBody).digest('hex');
        const received = signatureHeader.slice('sha256='.length);
        try {
            return (0, crypto_1.timingSafeEqual)(Buffer.from(expected, 'hex'), Buffer.from(received, 'hex'));
        }
        catch {
            return false;
        }
    }
};
exports.WhatsAppSignatureService = WhatsAppSignatureService;
exports.WhatsAppSignatureService = WhatsAppSignatureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WhatsAppSignatureService);
//# sourceMappingURL=whatsapp-signature.service.js.map