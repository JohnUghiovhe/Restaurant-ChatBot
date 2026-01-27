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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const create_order_item_dto_1 = require("./dto/create-order-item.dto");
const schedule_order_dto_1 = require("./dto/schedule-order.dto");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async getCurrentOrder(sessionId) {
        return this.orderService.getCurrentOrder(sessionId);
    }
    async addItem(dto) {
        return this.orderService.addItemToOrder(dto.sessionId, dto.menuItemId, dto.quantity);
    }
    async checkout(sessionId) {
        return this.orderService.checkoutOrder(sessionId);
    }
    async cancel(sessionId) {
        return this.orderService.cancelOrder(sessionId);
    }
    async getHistory(sessionId) {
        return this.orderService.getOrderHistory(sessionId);
    }
    async schedule(dto) {
        return this.orderService.scheduleOrder(dto.sessionId, dto.scheduledFor);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Get)('current/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getCurrentOrder", null);
__decorate([
    (0, common_1.Post)('add-item'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_item_dto_1.CreateOrderItemDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "addItem", null);
__decorate([
    (0, common_1.Post)('checkout/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "checkout", null);
__decorate([
    (0, common_1.Post)('cancel/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('history/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)('schedule'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_order_dto_1.ScheduleOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "schedule", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map