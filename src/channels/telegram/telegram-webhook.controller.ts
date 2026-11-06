import { Body, Controller, Param, Post } from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { ChannelRouterService } from '../channel-router.service';
import type { InboundChannelMessage } from '../channel.types';
import { ConversationOrchestratorService } from '../../conversation/conversation-orchestrator.service';
import { PrismaService } from '../../prisma/prisma.service';

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    text?: string;
    chat: { id: number };
    from?: { first_name?: string; username?: string };
  };
}

@Controller('webhooks/telegram')
export class TelegramWebhookController {
  constructor(
    private readonly router: ChannelRouterService,
    private readonly orchestrator: ConversationOrchestratorService,
    private readonly prisma: PrismaService,
  ) {}

  @Post(':merchantSlug')
  async handle(@Param('merchantSlug') merchantSlug: string, @Body() update: TelegramUpdate) {
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
    const inbound: InboundChannelMessage = {
      channel: ChannelType.telegram,
      merchantId: merchant.id,
      externalChatId: String(msg.chat.id),
      externalMessageId,
      text: msg.text,
      customerLabel: msg.from?.first_name ?? msg.from?.username ?? 'Cliente',
    };
    await this.orchestrator.handleInbound(inbound);
    return { ok: true };
  }
}
