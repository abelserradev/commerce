import { Module } from '@nestjs/common';
import { ConversationModule } from '../../conversation/conversation.module';
import { ChannelRouterService } from '../channel-router.service';
import { WhatsAppSignatureService } from './whatsapp-signature.service';
import { WhatsAppWebhookController } from './whatsapp-webhook.controller';

@Module({
  imports: [ConversationModule],
  controllers: [WhatsAppWebhookController],
  providers: [WhatsAppSignatureService, ChannelRouterService],
})
export class WhatsAppModule {}
