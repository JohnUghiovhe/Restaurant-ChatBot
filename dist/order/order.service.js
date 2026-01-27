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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const menu_item_entity_1 = require("../entities/menu-item.entity");
const menu_service_1 = require("../menu/menu.service");
let OrderService = class OrderService {
    constructor(orderRepository, orderItemRepository, menuItemRepository, menuService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.menuService = menuService;
    }
    async getCurrentOrder(sessionId) {
        return this.orderRepository.findOne({
            where: {
                sessionId,
                status: order_entity_1.OrderStatus.PENDING,
            },
            relations: ['items', 'items.menuItem'],
            order: { createdAt: 'DESC' },
        });
    }
    async createOrder(sessionId) {
        const existingOrder = await this.getCurrentOrder(sessionId);
        if (existingOrder) {
            return existingOrder;
        }
        const order = this.orderRepository.create({
            sessionId,
            status: order_entity_1.OrderStatus.PENDING,
            totalAmount: 0,
        });
        return this.orderRepository.save(order);
    }
    async addItemToOrder(sessionId, menuItemId, quantity = 1) {
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than 0');
        }
        const menuItem = await this.menuService.findById(menuItemId);
        if (!menuItem) {
            throw new common_1.NotFoundException(`Menu item with ID ${menuItemId} not found`);
        }
        if (!menuItem.available) {
            throw new common_1.BadRequestException('Menu item is not available');
        }
        let order = await this.getCurrentOrder(sessionId);
        if (!order) {
            order = await this.createOrder(sessionId);
        }
        const existingOrderItem = await this.orderItemRepository.findOne({
            where: {
                orderId: order.id,
                menuItemId: menuItem.id,
            },
        });
        if (existingOrderItem) {
            existingOrderItem.quantity += quantity;
            await this.orderItemRepository.save(existingOrderItem);
        }
        else {
            const orderItem = this.orderItemRepository.create({
                orderId: order.id,
                menuItemId: menuItem.id,
                quantity,
                price: menuItem.price,
            });
            await this.orderItemRepository.save(orderItem);
        }
        await this.calculateTotal(order.id);
        return this.getCurrentOrder(sessionId);
    }
    async calculateTotal(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items'],
        });
        if (!order) {
            return;
        }
        const total = order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        order.totalAmount = total;
        await this.orderRepository.save(order);
    }
    async checkoutOrder(sessionId) {
        const order = await this.getCurrentOrder(sessionId);
        if (!order || order.items.length === 0) {
            throw new common_1.BadRequestException('No order to place');
        }
        order.status = order_entity_1.OrderStatus.PLACED;
        return this.orderRepository.save(order);
    }
    async cancelOrder(sessionId) {
        const order = await this.getCurrentOrder(sessionId);
        if (!order) {
            throw new common_1.BadRequestException('No order to cancel');
        }
        order.status = order_entity_1.OrderStatus.CANCELLED;
        await this.orderRepository.save(order);
    }
    async getOrderHistory(sessionId) {
        return this.orderRepository.find({
            where: {
                sessionId,
                status: order_entity_1.OrderStatus.PLACED,
            },
            relations: ['items', 'items.menuItem'],
            order: { createdAt: 'DESC' },
        });
    }
    async getOrderById(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items', 'items.menuItem'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.getOrderById(orderId);
        order.status = status;
        return this.orderRepository.save(order);
    }
    async updatePaymentReference(orderId, paymentReference) {
        const order = await this.getOrderById(orderId);
        order.paymentReference = paymentReference;
        return this.orderRepository.save(order);
    }
    async scheduleOrder(sessionId, scheduledFor) {
        const order = await this.getCurrentOrder(sessionId);
        if (!order || order.items.length === 0) {
            throw new common_1.BadRequestException('No order to schedule');
        }
        if (scheduledFor <= new Date()) {
            throw new common_1.BadRequestException('Scheduled time must be in the future');
        }
        order.scheduledFor = scheduledFor;
        order.status = order_entity_1.OrderStatus.SCHEDULED;
        return this.orderRepository.save(order);
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        menu_service_1.MenuService])
], OrderService);
//# sourceMappingURL=order.service.js.map