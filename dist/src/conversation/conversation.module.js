"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModule = void 0;
const common_1 = require("@nestjs/common");
const catalog_module_1 = require("../catalog/catalog.module");
const orders_module_1 = require("../orders/orders.module");
const channel_outbound_module_1 = require("../channels/outbound/channel-outbound.module");
const conversation_orchestrator_service_1 = require("./conversation-orchestrator.service");
let ConversationModule = class ConversationModule {
};
exports.ConversationModule = ConversationModule;
exports.ConversationModule = ConversationModule = __decorate([
    (0, common_1.Module)({
        imports: [catalog_module_1.CatalogModule, orders_module_1.OrdersModule, channel_outbound_module_1.ChannelOutboundModule],
        providers: [conversation_orchestrator_service_1.ConversationOrchestratorService],
        exports: [conversation_orchestrator_service_1.ConversationOrchestratorService],
    })
], ConversationModule);
//# sourceMappingURL=conversation.module.js.map