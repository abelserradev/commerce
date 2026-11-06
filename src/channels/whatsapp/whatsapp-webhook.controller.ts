import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { ChannelType } from '@prisma/client';
import { ChannelRouterService } from '../channel-router.service';
import type { InboundChannelMessage } from '../channel.types';
import { ConversationOrchestratorService } from '../../conversation/conversation-orchestrator.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { WhatsAppSignatureService } from './whatsapp-signature.service';

@Controller('webhooks/whatsapp')
export class WhatsAppWebhookController {
  constructor(
    private readonly config: ConfigService,
    private readonly signatures: WhatsAppSignatureService,
    private readonly router: ChannelRouterService,
    private readonly orchestrator: ConversationOrchestratorService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    const expected = this.config.get<string>('WHATSAPP_VERIFY_TOKEN') ?? '';
    if (mode === 'subscribe' && token === expected) {
      return challenge;
    }
    throw new ForbiddenException();
  }

  @Post()
  async inbound(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-hub-signature-256') signature: string | undefined,
    @Body() body: Record<string, unknown>,
  ) {
    const raw = req.rawBody ?? Buffer.from(JSON.stringify(body));
    if (!this.signatures.verify(raw, signature)) {
      throw new ForbiddenException();
    }
    const entry = (body.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
    const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
    const value = change?.value as Record<string, unknown> | undefined;
    const phoneNumberId = (value?.metadata as Record<string, string> | undefined)?.phone_number_id;
    const messages = (value?.messages as unknown[]) ?? [];
    if (!phoneNumberId || !messages.length) {
      return { ok: true };
    }
    const merchantId = await this.router.resolveMerchantByChannelExternalId(
      ChannelType.whatsapp,
      phoneNumberId,
    );
    for (const rawMsg of messages) {
      const msg = rawMsg as Record<string, unknown>;
      const messageId = String(msg.id ?? '');
      const textBody = (msg.text as Record<string, string> | undefined)?.body ?? '';
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
      const inbound: InboundChannelMessage = {
        channel: ChannelType.whatsapp,
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
}
