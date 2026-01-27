import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { InitializePaymentDto } from '../payment/dto/initialize-payment.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(dto: SendMessageDto): Promise<any>;
    initialize(deviceId: string): Promise<any>;
    initializePayment(dto: InitializePaymentDto): Promise<any>;
    scheduleOrder(dto: {
        deviceId: string;
        scheduledFor: Date;
    }): Promise<any>;
}
