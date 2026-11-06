import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        merchant: {
            id: string;
            name: string;
            slug: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        merchant: {
            id: string;
            name: string;
            slug: string;
        };
    }>;
    private signToken;
}
