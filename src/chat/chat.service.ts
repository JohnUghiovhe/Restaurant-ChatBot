import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { OrderService } from '../order/order.service';
import { MenuService } from '../menu/menu.service';
import { PaymentService } from '../payment/payment.service';
import { OrderStatus } from '../entities/order.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private orderService: OrderService,
    private menuService: MenuService,
    private paymentService: PaymentService,
  ) {}

  async getOrCreateSession(deviceId: string): Promise<Session> {
    let session = await this.sessionRepository.findOne({
      where: { deviceId },
    });

    if (!session) {
      session = this.sessionRepository.create({ deviceId });
      session = await this.sessionRepository.save(session);
    }

    return session;
  }

  async processMessage(deviceId: string, message: string): Promise<any> {
    const session = await this.getOrCreateSession(deviceId);
    const input = message.trim();

    // Handle numeric input
    if (/^\d+$/.test(input)) {
      const number = parseInt(input, 10);

      // If we're currently selecting from the menu, treat 1..N as menu items
      // (this fixes the conflict where "1" was being interpreted as "Place an order")
      if (session.mode === 'menu') {
        // Allow main-menu shortcuts even while browsing the menu
        if ([0, 97, 98, 99].includes(number)) {
          session.mode = 'main';
          await this.sessionRepository.save(session);
          return this.handleMenuOption(session, number);
        }

        const menuItems = await this.menuService.findAll();
        if (number >= 1 && number <= menuItems.length) {
          return this.handleMenuItemSelection(session, number);
        }

        // Any other number exits menu selection mode back to main menu
        session.mode = 'main';
        await this.sessionRepository.save(session);
        return this.getMainMenu();
      }

      // Not in menu selection mode: treat main menu options normally
      if ([0, 1, 97, 98, 99].includes(number)) {
        return this.handleMenuOption(session, number);
      }

      // Otherwise, try to add as menu item
      return this.handleMenuItemSelection(session, number);
    }

    // Default: show main menu
    return this.getMainMenu();
  }

  private async handleMenuOption(session: Session, option: number): Promise<any> {
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

  private async handlePlaceOrder(session: Session): Promise<any> {
    const menuItems = await this.menuService.findAll();
    
    if (menuItems.length === 0) {
      return {
        message: 'Sorry, no menu items available at the moment.',
        options: this.getMainMenuOptions(),
      };
    }

    // Enter menu selection mode so "1" selects the first item (e.g., Jollof Rice)
    session.mode = 'menu';
    await this.sessionRepository.save(session);

    const menuText = this.formatMenuText(menuItems);

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

  private async handleMenuItemSelection(session: Session, itemNumber: number): Promise<any> {
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
      const menuText = this.formatMenuText(menuItems);
      
      return {
        message: `✅ ${selectedItem.name} added to your order!\n\n${orderSummary}\n\nAvailable menu items:\n${menuText}\n\nSelect another item number to add more, or use a shortcut:\nSelect 99 to checkout order\nSelect 97 to see current order\nSelect 0 to cancel order.`,
        order: currentOrder,
      };
    } catch (error) {
      return {
        message: `Error: ${error.message}`,
        options: this.getMainMenuOptions(),
      };
    }
  }

  private formatMenuText(menuItems: any[]): string {
    return menuItems
      .map((item, index) => {
        const number = index + 1;
        return `Select ${number} for ${item.name} - ₦${item.price.toFixed(2)} (${item.description})`;
      })
      .join('\n');
  }

  private async handleCheckout(session: Session): Promise<any> {
    try {
      const order = await this.orderService.checkoutOrder(session.id);
      
      return {
        message: '✅ Order placed successfully!\n\nWould you like to proceed with payment?',
        order: order,
        paymentRequired: true,
        options: this.getMainMenuOptions(),
      };
    } catch (error) {
      return {
        message: '❌ No order to place. Please add items to your order first.',
        options: this.getMainMenuOptions(),
      };
    }
  }

  async handleScheduleOrder(sessionId: string, scheduledFor: Date): Promise<any> {
    try {
      const session = await this.getOrCreateSession(sessionId);
      const order = await this.orderService.scheduleOrder(session.id, scheduledFor);
      
      return {
        message: `✅ Order scheduled successfully for ${scheduledFor.toLocaleString()}!\n\n${this.getMainMenuOptions()}`,
        order: order,
      };
    } catch (error) {
      return {
        message: `❌ Error: ${error.message}`,
        options: this.getMainMenuOptions(),
      };
    }
  }

  private async handleOrderHistory(session: Session): Promise<any> {
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

  private async handleCurrentOrder(session: Session): Promise<any> {
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

  private async handleCancelOrder(session: Session): Promise<any> {
    try {
      await this.orderService.cancelOrder(session.id);
      return {
        message: '✅ Order cancelled successfully.',
        options: this.getMainMenuOptions(),
      };
    } catch (error) {
      return {
        message: '❌ No order to cancel.',
        options: this.getMainMenuOptions(),
      };
    }
  }

  private formatOrderSummary(order: any): string {
    if (!order || !order.items || order.items.length === 0) {
      return 'Your order is empty.';
    }

    const items = order.items
      .map((item: any) => {
        const itemName = item.menuItem?.name || 'Unknown';
        return `  • ${item.quantity}x ${itemName} - ₦${(Number(item.price) * item.quantity).toFixed(2)}`;
      })
      .join('\n');

    return `Items:\n${items}\n\nTotal: ₦${Number(order.totalAmount).toFixed(2)}`;
  }

  private getMainMenu(): any {
    return {
      message: 'Welcome to our Restaurant Chatbot! 👋\n\nHow can I help you today?',
      options: this.getMainMenuOptions(),
    };
  }

  private getMainMenuOptions(): string {
    return `Select 1 to Place an order
Select 99 to checkout order
Select 98 to see order history
Select 97 to see current order
Select 0 to cancel order`;
  }

  async initializePaymentForOrder(orderId: string, email: string) {
    const order = await this.orderService.getOrderById(orderId);
    
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    
    if (order.status !== OrderStatus.PLACED) {
      throw new BadRequestException('Order is not ready for payment');
    }
    
    if (!order.totalAmount || order.totalAmount <= 0) {
      throw new BadRequestException('Invalid order amount');
    }

    return this.paymentService.initializePayment(
      orderId,
      email,
      Number(order.totalAmount),
    );
  }
}
