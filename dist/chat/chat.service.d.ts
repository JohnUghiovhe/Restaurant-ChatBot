import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { OrderService } from '../order/order.service';
import { MenuService } from '../menu/menu.service';
import { PaymentService } from '../payment/payment.service';
export declare class ChatService {
    private sessionRepository;
    private orderService;
    private menuService;
    private paymentService;
    constructor(sessionRepository: Repository<Session>, orderService: OrderService, menuService: MenuService, paymentService: PaymentService);
    getOrCreateSession(deviceId: string): Promise<Session>;
    processMessage(deviceId: string, message: string): Promise<any>;
    private handleMenuOption;
    private handlePlaceOrder;
    private handleMenuItemSelection;
    private handleCheckout;
    handleScheduleOrder(sessionId: string, scheduledFor: Date): Promise<any>;
    private handleOrderHistory;
    private handleCurrentOrder;
    private handleCancelOrder;
    private formatOrderSummary;
    private getMainMenu;
    private getMainMenuOptions;
    initializePaymentForOrder(orderId: string, email: string): Promise<any>;
}
