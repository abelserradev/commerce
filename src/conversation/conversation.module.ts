import { Module } from '@nestjs/common';
import { CatalogModule } from '../catalog/catalog.module';
import { OrdersModule } from '../orders/orders.module';
import { ChannelOutboundModule } from '../channels/outbound/channel-outbound.module';
import { ConversationOrchestratorService } from './conversation-orchestrator.service';

@Module({
  imports: [CatalogModule, OrdersModule, ChannelOutboundModule],
  providers: [ConversationOrchestratorService],
  exports: [ConversationOrchestratorService],
})
export class ConversationModule {}
