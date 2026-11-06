import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { ChannelRouterService } from '../channel-router.service';
import { ConversationOrchestratorService } from '../../conversation/conversation-orchestrator.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { WhatsAppSignatureService } from './whatsapp-signature.service';
export declare class WhatsAppWebhookController {
    private readonly config;
    private readonly signatures;
    private readonly router;
    private readonly orchestrator;
    private readonly prisma;
    constructor(config: ConfigService, signatures: WhatsAppSignatureService, router: ChannelRouterService, orchestrator: ConversationOrchestratorService, prisma: PrismaService);
    verify(mode: string, token: string, challenge: string): string;
    inbound(req: RawBodyRequest<Request>, signature: string | undefined, body: Record<string, unknown>): Promise<{
        ok: boolean;
    }>;
}
