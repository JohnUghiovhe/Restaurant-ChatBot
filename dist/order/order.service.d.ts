import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuService } from '../menu/menu.service';
export declare class OrderService {
    private orderRepository;
    private orderItemRepository;
    private menuItemRepository;
    private menuService;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, menuItemRepository: Repository<MenuItem>, menuService: MenuService);
    getCurrentOrder(sessionId: string): Promise<Order | null>;
    createOrder(sessionId: string): Promise<Order>;
    addItemToOrder(sessionId: string, menuItemId: number, quantity?: number): Promise<Order>;
    calculateTotal(orderId: string): Promise<void>;
    checkoutOrder(sessionId: string): Promise<Order>;
    cancelOrder(sessionId: string): Promise<void>;
    getOrderHistory(sessionId: string): Promise<Order[]>;
    getOrderById(orderId: string): Promise<Order>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
    updatePaymentReference(orderId: string, paymentReference: string): Promise<Order>;
    scheduleOrder(sessionId: string, scheduledFor: Date): Promise<Order>;
}
