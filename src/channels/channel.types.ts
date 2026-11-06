import type { ChannelType } from '@prisma/client';

export interface InboundChannelMessage {
  channel: ChannelType;
  merchantId: string;
  externalChatId: string;
  externalMessageId: string;
  text: string;
  customerLabel: string;
}
