import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { ScheduleOrderDto } from './dto/schedule-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('current/:sessionId')
  async getCurrentOrder(@Param('sessionId') sessionId: string) {
    return this.orderService.getCurrentOrder(sessionId);
  }

  @Post('add-item')
  async addItem(@Body() dto: CreateOrderItemDto) {
    return this.orderService.addItemToOrder(
      dto.sessionId,
      dto.menuItemId,
      dto.quantity,
    );
  }

  @Post('checkout/:sessionId')
  async checkout(@Param('sessionId') sessionId: string) {
    return this.orderService.checkoutOrder(sessionId);
  }

  @Post('cancel/:sessionId')
  async cancel(@Param('sessionId') sessionId: string) {
    return this.orderService.cancelOrder(sessionId);
  }

  @Get('history/:sessionId')
  async getHistory(@Param('sessionId') sessionId: string) {
    return this.orderService.getOrderHistory(sessionId);
  }

  @Post('schedule')
  async schedule(@Body() dto: ScheduleOrderDto) {
    return this.orderService.scheduleOrder(dto.sessionId, dto.scheduledFor);
  }
}
