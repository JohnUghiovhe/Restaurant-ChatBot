import { IsNotEmpty, IsDateString } from 'class-validator';

export class ScheduleOrderDto {
  @IsNotEmpty()
  sessionId: string;

  @IsDateString()
  scheduledFor: Date;
}
