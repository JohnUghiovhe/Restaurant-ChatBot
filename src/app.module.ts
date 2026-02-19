import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { OrderModule } from './order/order.module';
import { MenuModule } from './menu/menu.module';
import { PaymentModule } from './payment/payment.module';
import { AppController } from './app.controller';
import { Session } from './entities/session.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { MenuItem } from './entities/menu-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'restaurant.db',
      entities: [Session, Order, OrderItem, MenuItem],
      synchronize: true,
    }),
    ChatModule,
    OrderModule,
    MenuModule,
    PaymentModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
