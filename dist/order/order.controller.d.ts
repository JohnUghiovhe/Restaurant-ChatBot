import { OrderService } from './order.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { ScheduleOrderDto } from './dto/schedule-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getCurrentOrder(sessionId: string): Promise<import("../entities/order.entity").Order>;
    addItem(dto: CreateOrderItemDto): Promise<import("../entities/order.entity").Order>;
    checkout(sessionId: string): Promise<import("../entities/order.entity").Order>;
    cancel(sessionId: string): Promise<void>;
    getHistory(sessionId: string): Promise<import("../entities/order.entity").Order[]>;
    schedule(dto: ScheduleOrderDto): Promise<import("../entities/order.entity").Order>;
}
