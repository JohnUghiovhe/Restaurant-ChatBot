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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("../entities/session.entity");
const order_service_1 = require("../order/order.service");
const menu_service_1 = require("../menu/menu.service");
const payment_service_1 = require("../payment/payment.service");
const order_entity_1 = require("../entities/order.entity");
let ChatService = class ChatService {
    constructor(sessionRepository, orderService, menuService, paymentService) {
        this.sessionRepository = sessionRepository;
        this.orderService = orderService;
        this.menuService = menuService;
        this.paymentService = paymentService;
    }
    async getOrCreateSession(deviceId) {
        let session = await this.sessionRepository.findOne({
            where: { deviceId },
        });
        if (!session) {
            session = this.sessionRepository.create({ deviceId });
            session = await this.sessionRepository.save(session);
        }
        return session;
    }
    async processMessage(deviceId, message) {
        const session = await this.getOrCreateSession(deviceId);
        const input = message.trim();
        if (/^\d+$/.test(input)) {
            const number = parseInt(input, 10);
            if (session.mode === 'menu') {
                if ([0, 97, 98, 99].includes(number)) {
                    session.mode = 'main';
                    await this.sessionRepository.save(session);
                    return this.handleMenuOption(session, number);
                }
                const menuItems = await this.menuService.findAll();
                if (number >= 1 && number <= menuItems.length) {
                    return this.handleMenuItemSelection(session, number);
                }
                session.mode = 'main';
                await this.sessionRepository.save(session);
                return this.getMainMenu();
            }
            if ([0, 1, 97, 98, 99].includes(number)) {
                return this.handleMenuOption(session, number);
            }
            return this.handleMenuItemSelection(session, number);
        }
        return this.getMainMenu();
    }
    async handleMenuOption(session, option) {
        switch (option) {
            case 1:
                return this.handlePlaceOrder(session);
            case 99:
                return this.handleCheckout(session);
            case 98:
                return this.handleOrderHistory(session);
            case 97:
                return this.handleCurrentOrder(session);
            case 0:
                return this.handleCancelOrder(session);
            default:
                return {
                    message: 'Invalid option. Please select a valid option.',
                    options: this.getMainMenuOptions(),
                };
        }
    }
    async handlePlaceOrder(session) {
        const menuItems = await this.menuService.findAll();
        if (menuItems.length === 0) {
            return {
                message: 'Sorry, no menu items available at the moment.',
                options: this.getMainMenuOptions(),
            };
        }
        session.mode = 'menu';
        await this.sessionRepository.save(session);
        const menuText = menuItems
            .map((item, index) => {
            const number = index + 1;
            return `Select ${number} for ${item.name} - ₦${item.price.toFixed(2)} (${item.description})`;
        })
            .join('\n');
        return {
            message: `Here are our available menu items:\n\n${menuText}\n\nPlease select an item by number, or type any other number to return to main menu.`,
            menuItems: menuItems.map((item, index) => ({
                number: index + 1,
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
            })),
        };
    }
    async handleMenuItemSelection(session, itemNumber) {
        const menuItems = await this.menuService.findAll();
        if (itemNumber < 1 || itemNumber > menuItems.length) {
            return {
                message: 'Invalid selection. Please select a valid menu item number.',
                options: this.getMainMenuOptions(),
            };
        }
        const selectedItem = menuItems[itemNumber - 1];
        try {
            await this.orderService.addItemToOrder(session.id, selectedItem.id, 1);
            const currentOrder = await this.orderService.getCurrentOrder(session.id);
            const orderSummary = this.formatOrderSummary(currentOrder);
            return {
                message: `✅ ${selectedItem.name} added to your order!\n\n${orderSummary}\n\nSelect another item number to add more, or:\n${this.getMainMenuOptions()}`,
                order: currentOrder,
            };
        }
        catch (error) {
            return {
                message: `Error: ${error.message}`,
                options: this.getMainMenuOptions(),
            };
        }
    }
    async handleCheckout(session) {
        try {
            const order = await this.orderService.checkoutOrder(session.id);
            return {
                message: '✅ Order placed successfully!\n\nWould you like to proceed with payment?',
                order: order,
                paymentRequired: true,
                options: this.getMainMenuOptions(),
            };
        }
        catch (error) {
            return {
                message: '❌ No order to place. Please add items to your order first.',
                options: this.getMainMenuOptions(),
            };
        }
    }
    async handleScheduleOrder(sessionId, scheduledFor) {
        try {
            const session = await this.getOrCreateSession(sessionId);
            const order = await this.orderService.scheduleOrder(session.id, scheduledFor);
            return {
                message: `✅ Order scheduled successfully for ${scheduledFor.toLocaleString()}!\n\n${this.getMainMenuOptions()}`,
                order: order,
            };
        }
        catch (error) {
            return {
                message: `❌ Error: ${error.message}`,
                options: this.getMainMenuOptions(),
            };
        }
    }
    async handleOrderHistory(session) {
        const orders = await this.orderService.getOrderHistory(session.id);
        if (orders.length === 0) {
            return {
                message: 'You have no order history yet.',
                options: this.getMainMenuOptions(),
            };
        }
        const historyText = orders
            .map((order, index) => {
            const items = order.items
                .map((item) => `${item.quantity}x ${item.menuItem.name}`)
                .join(', ');
            return `${index + 1}. Order #${order.id.slice(0, 8)} - ₦${order.totalAmount.toFixed(2)} - ${items}`;
        })
            .join('\n');
        return {
            message: `Your Order History:\n\n${historyText}\n\n${this.getMainMenuOptions()}`,
            orders: orders,
        };
    }
    async handleCurrentOrder(session) {
        const order = await this.orderService.getCurrentOrder(session.id);
        if (!order || order.items.length === 0) {
            return {
                message: 'You have no current order.',
                options: this.getMainMenuOptions(),
            };
        }
        const orderSummary = this.formatOrderSummary(order);
        return {
            message: `Your Current Order:\n\n${orderSummary}\n\n${this.getMainMenuOptions()}`,
            order: order,
        };
    }
    async handleCancelOrder(session) {
        try {
            await this.orderService.cancelOrder(session.id);
            return {
                message: '✅ Order cancelled successfully.',
                options: this.getMainMenuOptions(),
            };
        }
        catch (error) {
            return {
                message: '❌ No order to cancel.',
                options: this.getMainMenuOptions(),
            };
        }
    }
    formatOrderSummary(order) {
        if (!order || !order.items || order.items.length === 0) {
            return 'Your order is empty.';
        }
        const items = order.items
            .map((item) => {
            const itemName = item.menuItem?.name || 'Unknown';
            return `  • ${item.quantity}x ${itemName} - ₦${(Number(item.price) * item.quantity).toFixed(2)}`;
        })
            .join('\n');
        return `Items:\n${items}\n\nTotal: ₦${Number(order.totalAmount).toFixed(2)}`;
    }
    getMainMenu() {
        return {
            message: 'Welcome to our Restaurant Chatbot! 👋\n\nHow can I help you today?',
            options: this.getMainMenuOptions(),
        };
    }
    getMainMenuOptions() {
        return `Select 1 to Place an order
Select 99 to checkout order
Select 98 to see order history
Select 97 to see current order
Select 0 to cancel order`;
    }
    async initializePaymentForOrder(orderId, email) {
        const order = await this.orderService.getOrderById(orderId);
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        if (order.status !== order_entity_1.OrderStatus.PLACED) {
            throw new common_1.BadRequestException('Order is not ready for payment');
        }
        if (!order.totalAmount || order.totalAmount <= 0) {
            throw new common_1.BadRequestException('Invalid order amount');
        }
        return this.paymentService.initializePayment(orderId, email, Number(order.totalAmount));
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        order_service_1.OrderService,
        menu_service_1.MenuService,
        payment_service_1.PaymentService])
], ChatService);
//# sourceMappingURL=chat.service.js.map