import { CatalogService } from '../catalog/catalog.service';
import type { InboundChannelMessage } from '../channels/channel.types';
import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramOutboundService } from '../channels/outbound/telegram-outbound.service';
import { WhatsAppOutboundService } from '../channels/outbound/whatsapp-outbound.service';
export declare class ConversationOrchestratorService {
    private readonly prisma;
    private readonly catalog;
    private readonly orders;
    private readonly telegramOut;
    private readonly whatsappOut;
    constructor(prisma: PrismaService, catalog: CatalogService, orders: OrdersService, telegramOut: TelegramOutboundService, whatsappOut: WhatsAppOutboundService);
    handleInbound(message: InboundChannelMessage): Promise<string>;
    private sendCatalog;
    private addToCart;
    private describeCart;
    private confirmCart;
    private loadCart;
    private saveCart;
    private reply;
}
