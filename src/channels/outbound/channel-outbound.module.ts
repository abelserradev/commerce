import { Module } from '@nestjs/common';
import { TelegramOutboundService } from './telegram-outbound.service';
import { WhatsAppOutboundService } from './whatsapp-outbound.service';

@Module({
  providers: [TelegramOutboundService, WhatsAppOutboundService],
  exports: [TelegramOutboundService, WhatsAppOutboundService],
})
export class ChannelOutboundModule {}
