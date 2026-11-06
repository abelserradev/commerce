import { ConfigService } from '@nestjs/config';
export declare class WhatsAppOutboundService {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    sendText(to: string, text: string): Promise<void>;
}
