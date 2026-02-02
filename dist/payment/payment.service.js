"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const order_service_1 = require("../order/order.service");
const order_entity_1 = require("../entities/order.entity");
let PaymentService = class PaymentService {
    constructor(orderService) {
        this.orderService = orderService;
        this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
        this.baseUrl = 'https://api.paystack.co';
    }
    async initializePayment(orderId, email, amount) {
        if (!this.secretKey) {
            throw new common_1.BadRequestException('Paystack secret key is not configured.');
        }
        if (amount <= 0) {
            throw new common_1.BadRequestException('Amount must be greater than 0');
        }
        const reference = `order_${orderId}_${Date.now()}`;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const callbackUrl = frontendUrl;
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/transaction/initialize`, {
                email,
                amount: Math.round(amount * 100),
                reference,
                callback_url: callbackUrl,
                metadata: { orderId },
            }, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.data?.status || !response.data?.data) {
                throw new common_1.BadRequestException('Invalid response from Paystack');
            }
            await this.orderService.updatePaymentReference(orderId, reference);
            return response.data;
        }
        catch (error) {
            console.error('Payment initialization error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            if (error.response?.data?.message) {
                throw new common_1.BadRequestException(`Payment initialization failed: ${error.response.data.message}`);
            }
            if (error.message) {
                throw new common_1.BadRequestException(`Failed to initialize payment: ${error.message}`);
            }
            throw new common_1.BadRequestException('Failed to initialize payment. Please check your Paystack configuration.');
        }
    }
    async verifyPayment(reference) {
        if (!this.secretKey) {
            throw new common_1.BadRequestException('Paystack secret key is not configured.');
        }
        if (!reference) {
            throw new common_1.BadRequestException('Payment reference is required');
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                },
            });
            const paymentData = response.data?.data;
            if (!response.data?.status || !paymentData) {
                return { success: false, data: null };
            }
            const orderId = paymentData.metadata?.orderId;
            if (paymentData.status === 'success' && orderId) {
                await this.orderService.updateOrderStatus(orderId, order_entity_1.OrderStatus.PAID);
                await this.orderService.updatePaymentReference(orderId, reference);
                return { success: true, data: paymentData };
            }
            return { success: false, data: paymentData };
        }
        catch (error) {
            if (error.response?.status === 404) {
                throw new common_1.BadRequestException('Payment reference not found');
            }
            throw new common_1.BadRequestException('Failed to verify payment');
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map