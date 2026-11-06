import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WhatsAppWebhookController } from './whatsapp-webhook.controller';
import { WhatsAppSignatureService } from './whatsapp-signature.service';
import { ChannelRouterService } from '../channel-router.service';
import { ConversationOrchestratorService } from '../../conversation/conversation-orchestrator.service';
import { PrismaService } from '../../prisma/prisma.service';

/** REQ-COM-007, REQ-COM-008 */
describe('WhatsAppWebhookController', () => {
  let controller: WhatsAppWebhookController;
  const signatures = { verify: jest.fn() };
  const router = { resolveMerchantByChannelExternalId: jest.fn() };
  const orchestrator = { handleInbound: jest.fn() };
  const prisma = {
    webhookDedupe: { findUnique: jest.fn(), create: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsAppWebhookController],
      providers: [
        { provide: ConfigService, useValue: { get: () => 'verify-token' } },
        { provide: WhatsAppSignatureService, useValue: signatures },
        { provide: ChannelRouterService, useValue: router },
        { provide: ConversationOrchestratorService, useValue: orchestrator },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    controller = module.get(WhatsAppWebhookController);
    jest.clearAllMocks();
  });

  it('GET verify returns challenge when token matches', () => {
    expect(controller.verify('subscribe', 'verify-token', '12345')).toBe('12345');
  });

  it('POST rejects bad signature (REQ-COM-008)', async () => {
    signatures.verify.mockReturnValue(false);
    await expect(
      controller.inbound({ rawBody: Buffer.from('{}') } as never, 'bad', {}),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
