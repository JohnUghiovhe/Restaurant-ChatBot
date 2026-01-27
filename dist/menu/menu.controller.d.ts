import { MenuService } from './menu.service';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getMenu(): Promise<import("../entities/menu-item.entity").MenuItem[]>;
    getMenuItem(id: number): Promise<import("../entities/menu-item.entity").MenuItem>;
}
