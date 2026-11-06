import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus, Prisma } from '@prisma/client';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

/** REQ-COM-005, REQ-COM-006 */
describe('OrdersService', () => {
  let service: OrdersService;
  const tx = {
    product: { findMany: jest.fn(), update: jest.fn() },
    order: { create: jest.fn() },
  };
  const prisma = {
    order: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
    $transaction: jest.fn((fn: (t: typeof tx) => Promise<unknown>) => fn(tx)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(OrdersService);
    jest.clearAllMocks();
  });

  it('confirmFromCart is idempotent when idempotencyKey exists (REQ-COM-006)', async () => {
    prisma.order.findUnique.mockResolvedValue({
      id: 'o1',
      status: OrderStatus.confirmed,
      lines: [],
    });
    const result = await service.confirmFromCart({
      merchantId: 'm1',
      channel: 'telegram',
      externalChatId: '123',
      customerLabel: 'Ana',
      lines: [{ productId: 'p1', quantity: 1 }],
      idempotencyKey: 'idem-1',
    });
    expect(result.id).toBe('o1');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('confirmFromCart decrements stock in transaction (REQ-COM-005)', async () => {
    prisma.order.findUnique.mockResolvedValue(null);
    tx.product.findMany.mockResolvedValue([
      {
        id: 'p1',
        name: 'Pan',
        priceAmount: new Prisma.Decimal('2.00'),
        stockQty: 5,
      },
    ]);
    tx.order.create.mockResolvedValue({ id: 'o2', lines: [] });
    await service.confirmFromCart({
      merchantId: 'm1',
      channel: 'telegram',
      externalChatId: '123',
      customerLabel: 'Ana',
      lines: [{ productId: 'p1', quantity: 2 }],
      idempotencyKey: 'idem-2',
    });
    expect(tx.product.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'p1' },
        data: { stockQty: { decrement: 2 } },
      }),
    );
  });
});
