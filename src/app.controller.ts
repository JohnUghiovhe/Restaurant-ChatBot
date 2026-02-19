import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  getIndex(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        hasPaystackKey: !!process.env.PAYSTACK_SECRET_KEY,
        paystackKeyPrefix: process.env.PAYSTACK_SECRET_KEY
          ? process.env.PAYSTACK_SECRET_KEY.substring(0, 7) + '...'
          : 'NOT SET',
        frontendUrl: process.env.FRONTEND_URL || 'NOT SET (using default)',
        nodeEnv: process.env.NODE_ENV || 'development',
      },
    };
  }
}
