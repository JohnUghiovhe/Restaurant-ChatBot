import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import express, { type Request, type Response } from 'express';
import { config } from 'dotenv';
import { AppModule } from '../src/app.module';

config();

let cachedServer: express.Express | null = null;

async function getServer(): Promise<express.Express> {
  if (cachedServer) return cachedServer;

  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
    {
      logger: ['error', 'warn', 'log'],
    },
  );

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'public'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.init();
  cachedServer = server;
  return server;
}

export default async function handler(req: Request, res: Response) {
  const server = await getServer();
  return server(req, res);
}

