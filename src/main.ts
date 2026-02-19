import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { config } from 'dotenv';
import { AppModule } from './app.module';

// Load environment variables from .env file
config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'public'));
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Try the configured port first, then fall back to the next ports if busy.
  const basePort = Number(process.env.PORT) || 3000;
  const maxAttempts = Number(process.env.PORT_TRY_COUNT) || 10;

  for (let i = 0; i < maxAttempts; i++) {
    const port = basePort + i;
    try {
      await app.listen(port);
      console.log(`Application is running on: http://localhost:${port}`);
      return;
    } catch (err: any) {
      const code = err?.code;
      if (code === 'EADDRINUSE') {
        // port is taken; try the next one
        continue;
      }
      throw err;
    }
  }

  throw new Error(
    `Could not start server. Ports ${basePort}-${basePort + maxAttempts - 1} are in use.`,
  );
}
bootstrap();
