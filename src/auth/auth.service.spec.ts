import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

/** REQ-COM-001 */
describe('AuthService', () => {
  let service: AuthService;
  const prisma = {
    merchantUser: { findUnique: jest.fn(), create: jest.fn() },
    merchant: { findUnique: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('token') } },
      ],
    }).compile();
    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  it('register creates merchant tenant and returns JWT (REQ-COM-001)', async () => {
    prisma.merchantUser.findUnique.mockResolvedValue(null);
    prisma.merchant.findUnique.mockResolvedValue(null);
    prisma.merchantUser.create.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      merchant: { id: 'm1', name: 'Shop', slug: 'shop' },
    });
    const result = await service.register({
      email: 'a@b.com',
      password: 'password1',
      merchantName: 'Shop',
      merchantSlug: 'shop',
    });
    expect(result.accessToken).toBe('token');
    expect(result.merchant.id).toBe('m1');
  });

  it('register rejects duplicate email', async () => {
    prisma.merchantUser.findUnique.mockResolvedValue({ id: 'x' });
    await expect(
      service.register({
        email: 'a@b.com',
        password: 'password1',
        merchantName: 'Shop',
        merchantSlug: 'shop',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
