import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class WhatsAppSignatureService {
  constructor(private readonly config: ConfigService) {}

  verify(rawBody: Buffer, signatureHeader: string | undefined): boolean {
    const secret = this.config.get<string>('WHATSAPP_APP_SECRET');
    if (!secret || !signatureHeader?.startsWith('sha256=')) {
      return false;
    }
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const received = signatureHeader.slice('sha256='.length);
    try {
      return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(received, 'hex'));
    } catch {
      return false;
    }
  }
}
