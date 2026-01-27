"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_item_entity_1 = require("../entities/menu-item.entity");
let MenuService = class MenuService {
    constructor(menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }
    async onModuleInit() {
        await this.seedMenuItems();
    }
    async findAll() {
        return this.menuItemRepository.find({
            where: { available: true },
            order: { id: 'ASC' },
        });
    }
    async findById(id) {
        return this.menuItemRepository.findOne({ where: { id } });
    }
    async findByIds(ids) {
        return this.menuItemRepository.findBy({ id: ids });
    }
    async seedMenuItems() {
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
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MenuService);
//# sourceMappingURL=menu.service.js.map