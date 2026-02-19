import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initialize')
  async initialize(@Body() dto: InitializePaymentDto) {
    return this.paymentService.initializePayment(
      dto.orderId,
      dto.email,
      dto.amount,
    );
  }

  @Get('verify')
  async verify(@Query('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }

  @Get('callback')
  async callback(@Query('reference') reference: string) {
    if (!reference) {
      return {
        success: false,
        message: 'Payment reference is required',
      };
    }

    try {
      const result = await this.paymentService.verifyPayment(reference);
      return {
        success: result.success,
        message: result.success
          ? 'Payment successful! Your order has been confirmed.'
          : 'Payment verification failed.',
        data: result.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Payment verification failed.',
      };
    }
  }
}
