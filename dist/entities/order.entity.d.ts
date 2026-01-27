import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PLACED = "placed",
    PAID = "paid",
    CANCELLED = "cancelled",
    SCHEDULED = "scheduled"
}
export declare class Order {
    id: string;
    sessionId: string;
    totalAmount: number;
    status: OrderStatus;
    paymentReference: string;
    scheduledFor: Date;
    items: OrderItem[];
    createdAt: Date;
}
