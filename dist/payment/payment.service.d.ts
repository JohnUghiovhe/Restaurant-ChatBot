import { OrderService } from '../order/order.service';
export declare class PaymentService {
    private readonly orderService;
    private readonly secretKey;
    private readonly baseUrl;
    constructor(orderService: OrderService);
    initializePayment(orderId: string, email: string, amount: number): Promise<any>;
    verifyPayment(reference: string): Promise<{
        success: boolean;
        data: any;
    }>;
}
