import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MenuItem } from '../entities/menu-item.entity';
export declare class MenuService implements OnModuleInit {
    private menuItemRepository;
    constructor(menuItemRepository: Repository<MenuItem>);
    onModuleInit(): Promise<void>;
    findAll(): Promise<MenuItem[]>;
    findById(id: number): Promise<MenuItem>;
    findByIds(ids: number[]): Promise<MenuItem[]>;
    private seedMenuItems;
}
