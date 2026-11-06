import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { ConversationModule } from './conversation/conversation.module';
import { HealthController } from './health.controller';
import { MerchantsModule } from './merchants/merchants.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { TelegramModule } from './channels/telegram/telegram.module';
import { WhatsAppModule } from './channels/whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    AuthModule,
    MerchantsModule,
    CatalogModule,
    OrdersModule,
    ConversationModule,
    TelegramModule,
    WhatsAppModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
