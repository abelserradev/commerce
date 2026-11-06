"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelOutboundModule = void 0;
const common_1 = require("@nestjs/common");
const telegram_outbound_service_1 = require("./telegram-outbound.service");
const whatsapp_outbound_service_1 = require("./whatsapp-outbound.service");
let ChannelOutboundModule = class ChannelOutboundModule {
};
exports.ChannelOutboundModule = ChannelOutboundModule;
exports.ChannelOutboundModule = ChannelOutboundModule = __decorate([
    (0, common_1.Module)({
        providers: [telegram_outbound_service_1.TelegramOutboundService, whatsapp_outbound_service_1.WhatsAppOutboundService],
        exports: [telegram_outbound_service_1.TelegramOutboundService, whatsapp_outbound_service_1.WhatsAppOutboundService],
    })
], ChannelOutboundModule);
//# sourceMappingURL=channel-outbound.module.js.map