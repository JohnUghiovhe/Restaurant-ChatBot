import { Order } from './order.entity';
import { MenuItem } from './menu-item.entity';
export declare class OrderItem {
    id: number;
    orderId: string;
    menuItemId: number;
    quantity: number;
    price: number;
    order: Order;
    menuItem: MenuItem;
}
