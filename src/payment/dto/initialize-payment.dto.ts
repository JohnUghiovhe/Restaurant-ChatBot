import { IsNotEmpty, IsEmail, IsNumber, IsPositive } from 'class-validator';

export class InitializePaymentDto {
  @IsNotEmpty()
  orderId: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
