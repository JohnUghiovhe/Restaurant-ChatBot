import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuService } from '../menu/menu.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
    private menuService: MenuService,
  ) {}

  async getCurrentOrder(sessionId: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: {
        sessionId,
        status: OrderStatus.PENDING,
      },
      relations: ['items', 'items.menuItem'],
      order: { createdAt: 'DESC' },
    });
  }

  async createOrder(sessionId: string): Promise<Order> {
    const existingOrder = await this.getCurrentOrder(sessionId);
    if (existingOrder) {
      return existingOrder;
    }

    const order = this.orderRepository.create({
      sessionId,
      status: OrderStatus.PENDING,
      totalAmount: 0,
    });

    return this.orderRepository.save(order);
  }

  async addItemToOrder(
    sessionId: string,
    menuItemId: number,
    quantity: number = 1,
  ): Promise<Order> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const menuItem = await this.menuService.findById(menuItemId);
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${menuItemId} not found`);
    }

    if (!menuItem.available) {
      throw new BadRequestException('Menu item is not available');
    }

    let order = await this.getCurrentOrder(sessionId);
    if (!order) {
      order = await this.createOrder(sessionId);
    }

    const existingOrderItem = await this.orderItemRepository.findOne({
      where: {
        orderId: order.id,
        menuItemId: menuItem.id,
      },
    });

    if (existingOrderItem) {
      existingOrderItem.quantity += quantity;
      await this.orderItemRepository.save(existingOrderItem);
    } else {
      const orderItem = this.orderItemRepository.create({
        orderId: order.id,
        menuItemId: menuItem.id,
        quantity,
        price: menuItem.price,
      });
      await this.orderItemRepository.save(orderItem);
    }

    await this.calculateTotal(order.id);
    return this.getCurrentOrder(sessionId);
  }

  async calculateTotal(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) {
      return;
    }

    const total = order.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    order.totalAmount = total;
    await this.orderRepository.save(order);
  }

  async checkoutOrder(sessionId: string): Promise<Order> {
    const order = await this.getCurrentOrder(sessionId);
    if (!order || order.items.length === 0) {
      throw new BadRequestException('No order to place');
    }

    order.status = OrderStatus.PLACED;
    return this.orderRepository.save(order);
  }

  async cancelOrder(sessionId: string): Promise<void> {
    const order = await this.getCurrentOrder(sessionId);
    if (!order) {
      throw new BadRequestException('No order to cancel');
    }

    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);
  }

  async getOrderHistory(sessionId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        sessionId,
        status: OrderStatus.PLACED,
      },
      relations: ['items', 'items.menuItem'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.menuItem'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderById(orderId);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async updatePaymentReference(orderId: string, paymentReference: string): Promise<Order> {
    const order = await this.getOrderById(orderId);
    order.paymentReference = paymentReference;
    return this.orderRepository.save(order);
  }

  async scheduleOrder(sessionId: string, scheduledFor: Date): Promise<Order> {
    const order = await this.getCurrentOrder(sessionId);
    if (!order || order.items.length === 0) {
      throw new BadRequestException('No order to schedule');
    }

    if (scheduledFor <= new Date()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    order.scheduledFor = scheduledFor;
    order.status = OrderStatus.SCHEDULED;
    return this.orderRepository.save(order);
  }
}
