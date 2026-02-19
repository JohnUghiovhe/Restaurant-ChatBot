import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../entities/session.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { OrderModule } from '../order/order.module';
import { MenuModule } from '../menu/menu.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    OrderModule,
    MenuModule,
    PaymentModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
