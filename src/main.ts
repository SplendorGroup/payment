import { AppModule } from '@/app.module';
import { PrismaHelper } from '@/core/helpers/prisma.helper';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as compression from 'compression';
import helmet from 'helmet';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    forceCloseConnections: true,
  });
  app.enableCors();

  await app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: process.env.RMQ_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  const configService = app.get(ConfigService);

  app.use(compression());
  app.use(helmet());

  app.get(PrismaHelper, { strict: false });
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Lanchonete Pagamentos API')
    .setDescription('API para a lanchonete.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.startAllMicroservices();

  async function gracefulShutdown(signal: NodeJS.Signals) {
    await app.close();
    process.kill(process.pid, signal);
  }

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);

  const PORT = configService.get('PORT') ?? 3008;
  await app.listen(PORT, () => {
    logger.debug(`Application is running on port ${PORT}`);
  });
}
bootstrap();
