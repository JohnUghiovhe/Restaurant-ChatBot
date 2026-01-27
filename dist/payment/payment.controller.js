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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const initialize_payment_dto_1 = require("./dto/initialize-payment.dto");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async initialize(dto) {
        return this.paymentService.initializePayment(dto.orderId, dto.email, dto.amount);
    }
    async verify(reference) {
        return this.paymentService.verifyPayment(reference);
    }
    async callback(reference) {
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
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Payment verification failed.',
            };
        }
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('initialize'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [initialize_payment_dto_1.InitializePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "initialize", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Query)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "callback", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map