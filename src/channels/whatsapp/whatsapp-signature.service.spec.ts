import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { WhatsAppSignatureService } from './whatsapp-signature.service';

/** REQ-COM-008 */
describe('WhatsAppSignatureService', () => {
  it('verify accepts valid HMAC (REQ-COM-008)', () => {
    const secret = 'test-secret';
    const body = Buffer.from('{"entry":[]}');
    const sig = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
    const service = new WhatsAppSignatureService({
      get: (key: string) => (key === 'WHATSAPP_APP_SECRET' ? secret : undefined),
    } as ConfigService);
    expect(service.verify(body, sig)).toBe(true);
  });

  it('verify rejects invalid signature', () => {
    const service = new WhatsAppSignatureService({
      get: () => 'secret',
    } as ConfigService);
    expect(service.verify(Buffer.from('x'), 'sha256=deadbeef')).toBe(false);
  });
});
