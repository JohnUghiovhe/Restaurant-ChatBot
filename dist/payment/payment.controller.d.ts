import { PaymentService } from './payment.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    initialize(dto: InitializePaymentDto): Promise<any>;
    verify(reference: string): Promise<{
        success: boolean;
        data: any;
    }>;
    callback(reference: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
