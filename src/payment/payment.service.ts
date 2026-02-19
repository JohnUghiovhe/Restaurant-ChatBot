import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '../entities/order.entity';

@Injectable()
export class PaymentService {
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY || '';
  private readonly baseUrl = 'https://api.paystack.co';

  constructor(private readonly orderService: OrderService) {
    // Log configuration on startup (without exposing the full key)
    console.log('Payment Service Configuration:', {
      hasSecretKey: !!this.secretKey,
      secretKeyPrefix: this.secretKey ? this.secretKey.substring(0, 7) + '...' : 'NOT SET',
      frontendUrl: process.env.FRONTEND_URL || 'NOT SET',
    });
  }

  async initializePayment(orderId: string, email: string, amount: number) {
    if (!this.secretKey) {
      throw new BadRequestException('Paystack secret key is not configured.');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const reference = `order_${orderId}_${Date.now()}`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const callbackUrl = frontendUrl;

    console.log('Initializing payment:', {
      orderId,
      email,
      amount,
      reference,
      callbackUrl,
    });

    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email,
          amount: Math.round(amount * 100),
          reference,
          callback_url: callbackUrl,
          metadata: { orderId },
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.data?.status || !response.data?.data) {
        console.error('Invalid Paystack response:', response.data);
        throw new BadRequestException('Invalid response from Paystack');
      }

      console.log('Payment initialized successfully:', {
        reference,
        authUrl: response.data.data.authorization_url,
      });

      await this.orderService.updatePaymentReference(orderId, reference);
      return response.data;
    } catch (error: any) {
      console.error('Payment initialization error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error.response?.data?.message) {
        throw new BadRequestException(`Payment initialization failed: ${error.response.data.message}`);
      }
      
      if (error.message) {
        throw new BadRequestException(`Failed to initialize payment: ${error.message}`);
      }
      
      throw new BadRequestException('Failed to initialize payment. Please check your Paystack configuration.');
    }
  }

  async verifyPayment(reference: string) {
    if (!this.secretKey) {
      throw new BadRequestException('Paystack secret key is not configured.');
    }

    if (!reference) {
      throw new BadRequestException('Payment reference is required');
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      const paymentData = response.data?.data;
      if (!response.data?.status || !paymentData) {
        return { success: false, data: null };
      }

      const orderId = paymentData.metadata?.orderId;

      if (paymentData.status === 'success' && orderId) {
        await this.orderService.updateOrderStatus(orderId, OrderStatus.PAID);
        await this.orderService.updatePaymentReference(orderId, reference);
        return { success: true, data: paymentData };
      }

      return { success: false, data: paymentData };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new BadRequestException('Payment reference not found');
      }
      throw new BadRequestException('Failed to verify payment');
    }
  }
}
