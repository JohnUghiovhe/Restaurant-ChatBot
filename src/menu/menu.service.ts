import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../entities/menu-item.entity';

@Injectable()
export class MenuService implements OnModuleInit {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async onModuleInit() {
    await this.seedMenuItems();
  }

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      where: { available: true },
      order: { id: 'ASC' },
    });
  }

  async findById(id: number): Promise<MenuItem> {
    return this.menuItemRepository.findOne({ where: { id } });
  }

  async findByIds(ids: number[]): Promise<MenuItem[]> {
    return this.menuItemRepository.findBy({ id: ids as any });
  }

  private async seedMenuItems() {
    const count = await this.menuItemRepository.count();
    if (count === 0) {
      const items = [
        {
          name: 'Jollof Rice',
          description: 'Delicious Nigerian jollof rice with chicken',
          price: 2500,
          category: 'Main Course',
          available: true,
        },
        {
          name: 'Fried Rice',
          description: 'Special fried rice with mixed vegetables and beef',
          price: 2800,
          category: 'Main Course',
          available: true,
        },
        {
          name: 'Pepper Soup',
          description: 'Spicy pepper soup with fish',
          price: 2000,
          category: 'Soup',
          available: true,
        },
        {
          name: 'Grilled Chicken',
          description: 'Tender grilled chicken with spices',
          price: 3500,
          category: 'Main Course',
          available: true,
        },
        {
          name: 'Beef Stew',
          description: 'Rich beef stew with vegetables',
          price: 3000,
          category: 'Main Course',
          available: true,
        },
        {
          name: 'Pounded Yam',
          description: 'Smooth pounded yam with egusi soup',
          price: 2200,
          category: 'Main Course',
          available: true,
        },
        {
          name: 'Chicken Wings',
          description: 'Crispy chicken wings (6 pieces)',
          price: 1800,
          category: 'Appetizer',
          available: true,
        },
        {
          name: 'Spring Rolls',
          description: 'Vegetable spring rolls (4 pieces)',
          price: 1500,
          category: 'Appetizer',
          available: true,
        },
        {
          name: 'Coca Cola',
          description: 'Cold soft drink',
          price: 300,
          category: 'Beverage',
          available: true,
        },
        {
          name: 'Orange Juice',
          description: 'Fresh orange juice',
          price: 500,
          category: 'Beverage',
          available: true,
        },
      ];

      await this.menuItemRepository.save(items);
    }
  }
}
