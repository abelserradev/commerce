import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../prisma/prisma.service';

/** REQ-COM-002, REQ-COM-003 */
describe('CatalogService', () => {
  let service: CatalogService;
  const prisma = {
    product: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(CatalogService);
    jest.clearAllMocks();
  });

  it('listPublishedForChat filters unpublished (REQ-COM-003)', async () => {
    prisma.product.findMany.mockResolvedValue([]);
    await service.listPublishedForChat('m1');
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ merchantId: 'm1', isPublished: true }),
      }),
    );
  });

  it('create scopes product to merchant (REQ-COM-002)', async () => {
    prisma.product.create.mockResolvedValue({ id: 'p1' });
    await service.create('m1', {
      name: 'Pan',
      priceAmount: 1.5,
      stockQty: 10,
    });
    expect(prisma.product.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ merchantId: 'm1', name: 'Pan' }),
      }),
    );
  });
});
