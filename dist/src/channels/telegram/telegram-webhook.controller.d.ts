import { ChannelRouterService } from '../channel-router.service';
import { ConversationOrchestratorService } from '../../conversation/conversation-orchestrator.service';
import { PrismaService } from '../../prisma/prisma.service';
interface TelegramUpdate {
    update_id: number;
    message?: {
        message_id: number;
        text?: string;
        chat: {
            id: number;
        };
        from?: {
            first_name?: string;
            username?: string;
        };
    };
}
export declare class TelegramWebhookController {
    private readonly router;
    private readonly orchestrator;
    private readonly prisma;
    constructor(router: ChannelRouterService, orchestrator: ConversationOrchestratorService, prisma: PrismaService);
    handle(merchantSlug: string, update: TelegramUpdate): Promise<{
        ok: boolean;
        deduped?: undefined;
    } | {
        ok: boolean;
        deduped: boolean;
    }>;
}
export {};
