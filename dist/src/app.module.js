"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const catalog_module_1 = require("./catalog/catalog.module");
const conversation_module_1 = require("./conversation/conversation.module");
const health_controller_1 = require("./health.controller");
const merchants_module_1 = require("./merchants/merchants.module");
const orders_module_1 = require("./orders/orders.module");
const prisma_module_1 = require("./prisma/prisma.module");
const telegram_module_1 = require("./channels/telegram/telegram.module");
const whatsapp_module_1 = require("./channels/whatsapp/whatsapp.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            merchants_module_1.MerchantsModule,
            catalog_module_1.CatalogModule,
            orders_module_1.OrdersModule,
            conversation_module_1.ConversationModule,
            telegram_module_1.TelegramModule,
            whatsapp_module_1.WhatsAppModule,
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map