import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string; merchant: { id: string; name: string; slug: string } }> {
    const existing = await this.prisma.merchantUser.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const slugTaken = await this.prisma.merchant.findUnique({ where: { slug: dto.merchantSlug } });
    if (slugTaken) {
      throw new ConflictException('Merchant slug taken');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.merchantUser.create({
      data: {
        email: dto.email,
        passwordHash,
        merchant: {
          create: {
            name: dto.merchantName,
            slug: dto.merchantSlug,
          },
        },
      },
      include: { merchant: true },
    });
    if (!user.merchant) {
      throw new ConflictException('Merchant creation failed');
    }
    const accessToken = this.signToken(user.id, user.merchant.id, user.email);
    return {
      accessToken,
      merchant: { id: user.merchant.id, name: user.merchant.name, slug: user.merchant.slug },
    };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; merchant: { id: string; name: string; slug: string } }> {
    const user = await this.prisma.merchantUser.findUnique({
      where: { email: dto.email },
      include: { merchant: true },
    });
    if (!user?.merchant) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      accessToken: this.signToken(user.id, user.merchant.id, user.email),
      merchant: { id: user.merchant.id, name: user.merchant.name, slug: user.merchant.slug },
    };
  }

  private signToken(userId: string, merchantId: string, email: string): string {
    return this.jwt.sign({ sub: userId, merchantId, email });
  }
}
