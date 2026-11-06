import { Test, TestingModule } from '@nestjs/testing';
import { ChannelType } from '@prisma/client';
import { ConversationOrchestratorService } from './conversation-orchestrator.service';
import { CatalogService } from '../catalog/catalog.service';
import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramOutboundService } from '../channels/outbound/telegram-outbound.service';
import { WhatsAppOutboundService } from '../channels/outbound/whatsapp-outbound.service';

/** REQ-COM-004, REQ-COM-005 */
describe('ConversationOrchestratorService', () => {
  let service: ConversationOrchestratorService;
  const catalog = { listPublishedForChat: jest.fn() };
  const orders = { confirmFromCart: jest.fn() };
  const prisma = {
    conversationSession: { findUnique: jest.fn(), upsert: jest.fn() },
  };
  const telegramOut = { sendText: jest.fn() };
  const whatsappOut = { sendText: jest.fn() };

  const inbound = {
    channel: ChannelType.telegram,
    merchantId: 'm1',
    externalChatId: '99',
    externalMessageId: 'msg1',
    text: 'menu',
    customerLabel: 'Cliente',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationOrchestratorService,
        { provide: CatalogService, useValue: catalog },
        { provide: OrdersService, useValue: orders },
        { provide: PrismaService, useValue: prisma },
        { provide: TelegramOutboundService, useValue: telegramOut },
        { provide: WhatsAppOutboundService, useValue: whatsappOut },
      ],
    }).compile();
    service = module.get(ConversationOrchestratorService);
    jest.clearAllMocks();
    prisma.conversationSession.findUnique.mockResolvedValue(null);
    prisma.conversationSession.upsert.mockResolvedValue({});
  });

  it('menu lists published products for merchant (REQ-COM-004)', async () => {
    catalog.listPublishedForChat.mockResolvedValue([
      { name: 'Pan', priceAmount: '1.00', currency: 'USD', stockQty: 3 },
    ]);
    const reply = await service.handleInbound(inbound);
    expect(catalog.listPublishedForChat).toHaveBeenCalledWith('m1');
    expect(reply).toContain('Pan');
    expect(telegramOut.sendText).toHaveBeenCalled();
  });
});
