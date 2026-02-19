import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  sessionId: string;

  @IsNumber()
  @IsPositive()
  menuItemId: number;

  @IsNumber()
  @Min(1)
  quantity: number = 1;
}
