"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_module_1 = require("./chat/chat.module");
const order_module_1 = require("./order/order.module");
const menu_module_1 = require("./menu/menu.module");
const payment_module_1 = require("./payment/payment.module");
const app_controller_1 = require("./app.controller");
const session_entity_1 = require("./entities/session.entity");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const menu_item_entity_1 = require("./entities/menu-item.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'restaurant.db',
                entities: [session_entity_1.Session, order_entity_1.Order, order_item_entity_1.OrderItem, menu_item_entity_1.MenuItem],
                synchronize: true,
            }),
            chat_module_1.ChatModule,
            order_module_1.OrderModule,
            menu_module_1.MenuModule,
            payment_module_1.PaymentModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map