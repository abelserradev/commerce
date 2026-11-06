import { ConfigService } from '@nestjs/config';
export declare class TelegramOutboundService {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    sendText(chatId: string, text: string): Promise<void>;
}
