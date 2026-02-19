import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { InitializePaymentDto } from '../payment/dto/initialize-payment.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(@Body() dto: SendMessageDto) {
    return this.chatService.processMessage(dto.deviceId, dto.message);
  }

  @Get('init/:deviceId')
  async initialize(@Param('deviceId') deviceId: string) {
    return this.chatService.processMessage(deviceId, '');
  }

  @Post('payment/initialize')
  async initializePayment(@Body() dto: InitializePaymentDto) {
    return this.chatService.initializePaymentForOrder(
      dto.orderId,
      dto.email,
    );
  }

  @Post('schedule')
  async scheduleOrder(@Body() dto: { deviceId: string; scheduledFor: Date }) {
    return this.chatService.handleScheduleOrder(
      dto.deviceId,
      new Date(dto.scheduledFor),
    );
  }
}
