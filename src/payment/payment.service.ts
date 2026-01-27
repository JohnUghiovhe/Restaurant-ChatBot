import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import axios from 'axios';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '../entities/order.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly paystackSecretKey: string;
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(private orderService: OrderService) {
    this.paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || '';
    
    if (!this.paystackSecretKey || this.paystackSecretKey === '') {
      this.logger.warn('PAYSTACK_SECRET_KEY is not set. Payment functionality will not work.');
    }
  }

  async initializePayment(orderId: string, email: string, amount: number) {
    if (!this.paystackSecretKey || this.paystackSecretKey === '') {
      throw new BadRequestException('Paystack secret key is not configured. Please set PAYSTACK_SECRET_KEY in your .env file.');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    try {
      const reference = `order_${orderId}_${Date.now()}`;
      const callbackUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/callback`;

      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          email,
          amount: Math.round(amount * 100), // Convert to kobo (smallest currency unit)
          reference,
          callback_url: callbackUrl,
          metadata: {
            orderId,
            custom_fields: [
              {
                display_name: 'Order ID',
                variable_name: 'order_id',
                value: orderId,
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.status && response.data.data) {
        // Store payment reference in order
        await this.orderService.updatePaymentReference(orderId, reference);
        
        this.logger.log(`Payment initialized for order ${orderId} with reference ${reference}`);
        return response.data;
      }

      throw new BadRequestException('Invalid response from Paystack');
    } catch (error) {
      this.logger.error(`Failed to initialize payment for order ${orderId}:`, error.response?.data || error.message);
      
      if (error.response?.data?.message) {
        throw new BadRequestException(`Payment initialization failed: ${error.response.data.message}`);
      }
      
      throw new BadRequestException('Failed to initialize payment. Please try again later.');
    }
  }

  async verifyPayment(reference: string) {
    if (!this.paystackSecretKey || this.paystackSecretKey === '') {
      throw new BadRequestException('Paystack secret key is not configured.');
    }

    if (!reference) {
      throw new BadRequestException('Payment reference is required');
    }

    try {
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        },
      );

      if (response.data.status && response.data.data) {
        const paymentData = response.data.data;
        const orderId = paymentData.metadata?.orderId;

        if (paymentData.status === 'success') {
          if (orderId) {
            // Update order status to PAID and store payment reference
            await this.orderService.updateOrderStatus(orderId, OrderStatus.PAID);
            await this.orderService.updatePaymentReference(orderId, reference);
            this.logger.log(`Payment verified successfully for order ${orderId}`);
          }
          
          return {
            success: true,
            message: 'Payment verified successfully',
            data: paymentData,
          };
        } else {
          this.logger.warn(`Payment verification failed for reference ${reference}: ${paymentData.status}`);
          return {
            success: false,
            message: `Payment status: ${paymentData.status}`,
            data: paymentData,
          };
        }
      }

      return {
        success: false,
        message: 'Invalid response from Paystack',
        data: null,
      };
    } catch (error) {
      this.logger.error(`Failed to verify payment for reference ${reference}:`, error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        throw new BadRequestException('Payment reference not found');
      }
      
      throw new BadRequestException('Failed to verify payment. Please try again later.');
    }
  }
}
