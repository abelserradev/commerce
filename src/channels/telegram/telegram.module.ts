import { Module } from '@nestjs/common';
import { ConversationModule } from '../../conversation/conversation.module';
import { ChannelRouterService } from '../channel-router.service';
import { TelegramWebhookController } from './telegram-webhook.controller';

@Module({
  imports: [ConversationModule],
  controllers: [TelegramWebhookController],
  providers: [ChannelRouterService],
})
export class TelegramModule {}
