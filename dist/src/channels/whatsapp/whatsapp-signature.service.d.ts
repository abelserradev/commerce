import { ConfigService } from '@nestjs/config';
export declare class WhatsAppSignatureService {
    private readonly config;
    constructor(config: ConfigService);
    verify(rawBody: Buffer, signatureHeader: string | undefined): boolean;
}
