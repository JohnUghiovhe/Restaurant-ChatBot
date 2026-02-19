import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenu() {
    return this.menuService.findAll();
  }

  @Get(':id')
  async getMenuItem(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findById(id);
  }
}
