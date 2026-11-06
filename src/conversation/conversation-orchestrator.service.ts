import { Injectable } from '@nestjs/common';
import { ChannelType, Prisma } from '@prisma/client';
import { CatalogService } from '../catalog/catalog.service';
import type { InboundChannelMessage } from '../channels/channel.types';
import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramOutboundService } from '../channels/outbound/telegram-outbound.service';
import { WhatsAppOutboundService } from '../channels/outbound/whatsapp-outbound.service';

interface CartState {
  lines: { productId: string; quantity: number }[];
}

@Injectable()
export class ConversationOrchestratorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: CatalogService,
    private readonly orders: OrdersService,
    private readonly telegramOut: TelegramOutboundService,
    private readonly whatsappOut: WhatsAppOutboundService,
  ) {}

  async handleInbound(message: InboundChannelMessage): Promise<string> {
    const text = message.text.trim().toLowerCase();
    if (text === '/start' || text === 'hola' || text === 'menu') {
      return this.sendCatalog(message);
    }
    if (text.startsWith('add ')) {
      return this.addToCart(message, text.replace('add ', '').trim());
    }
    if (text === 'confirmar' || text === 'confirm') {
      return this.confirmCart(message);
    }
    if (text === 'carrito' || text === 'cart') {
      return this.describeCart(message);
    }
    return (
      'Comandos: menu · add <número> · carrito · confirmar\n' +
      'Ejemplo: add 1 (elige el número del producto en menu)'
    );
  }

  private async sendCatalog(message: InboundChannelMessage): Promise<string> {
    const products = await this.catalog.listPublishedForChat(message.merchantId);
    if (!products.length) {
      const reply = 'No hay productos publicados con stock.';
      await this.reply(message, reply);
      return reply;
    }
    const lines = products.map(
      (p, i) => `${i + 1}. ${p.name} — ${p.priceAmount} ${p.currency} (stock ${p.stockQty})`,
    );
    const reply = ['Catálogo:', ...lines, '', 'Escribe: add <número>'].join('\n');
    await this.reply(message, reply);
    return reply;
  }

  private async addToCart(message: InboundChannelMessage, indexRaw: string): Promise<string> {
    const index = Number.parseInt(indexRaw, 10);
    if (!Number.isFinite(index) || index < 1) {
      const reply = 'Índice inválido. Usa menu y luego add 1, add 2, ...';
      await this.reply(message, reply);
      return reply;
    }
    const products = await this.catalog.listPublishedForChat(message.merchantId);
    const product = products[index - 1];
    if (!product) {
      const reply = 'Producto no encontrado en el catálogo.';
      await this.reply(message, reply);
      return reply;
    }
    const cart = await this.loadCart(message);
    const existing = cart.lines.find((l) => l.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.lines.push({ productId: product.id, quantity: 1 });
    }
    await this.saveCart(message, cart);
    const reply = `Agregado: ${product.name}. Escribe carrito o confirmar.`;
    await this.reply(message, reply);
    return reply;
  }

  private async describeCart(message: InboundChannelMessage): Promise<string> {
    const cart = await this.loadCart(message);
    if (!cart.lines.length) {
      const reply = 'Carrito vacío. Escribe menu.';
      await this.reply(message, reply);
      return reply;
    }
    const reply = `Carrito: ${cart.lines.length} línea(s). Escribe confirmar para pedir.`;
    await this.reply(message, reply);
    return reply;
  }

  private async confirmCart(message: InboundChannelMessage): Promise<string> {
    const cart = await this.loadCart(message);
    if (!cart.lines.length) {
      const reply = 'Carrito vacío.';
      await this.reply(message, reply);
      return reply;
    }
    const idempotencyKey = `${message.channel}:${message.externalChatId}:${message.externalMessageId}`;
    const order = await this.orders.confirmFromCart({
      merchantId: message.merchantId,
      channel: message.channel,
      externalChatId: message.externalChatId,
      customerLabel: message.customerLabel,
      lines: cart.lines,
      idempotencyKey,
    });
    await this.saveCart(message, { lines: [] });
    const reply = `Pedido confirmado #${order.id.slice(0, 8)}. Gracias por tu compra.`;
    await this.reply(message, reply);
    return reply;
  }

  private async loadCart(message: InboundChannelMessage): Promise<CartState> {
    const session = await this.prisma.conversationSession.findUnique({
      where: {
        merchantId_channel_externalChatId: {
          merchantId: message.merchantId,
          channel: message.channel,
          externalChatId: message.externalChatId,
        },
      },
    });
    if (!session?.cartJson || typeof session.cartJson !== 'object') {
      return { lines: [] };
    }
    const raw = session.cartJson as unknown as CartState;
    return { lines: Array.isArray(raw.lines) ? raw.lines : [] };
  }

  private async saveCart(message: InboundChannelMessage, cart: CartState): Promise<void> {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await this.prisma.conversationSession.upsert({
      where: {
        merchantId_channel_externalChatId: {
          merchantId: message.merchantId,
          channel: message.channel,
          externalChatId: message.externalChatId,
        },
      },
      create: {
        merchantId: message.merchantId,
        channel: message.channel,
        externalChatId: message.externalChatId,
        cartJson: cart as unknown as Prisma.InputJsonValue,
        expiresAt,
      },
      update: { cartJson: cart as unknown as Prisma.InputJsonValue, expiresAt },
    });
  }

  private async reply(message: InboundChannelMessage, text: string): Promise<void> {
    if (message.channel === ChannelType.telegram) {
      await this.telegramOut.sendText(message.externalChatId, text);
      return;
    }
    await this.whatsappOut.sendText(message.externalChatId, text);
  }
}
