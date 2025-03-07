import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { BackendAppModule } from './app/backend.module';

async function bootstrap() {
  const app = await NestFactory.create(BackendAppModule, {
    logger: process.env.ENV === 'production' ? ['warn', 'error'] : ['debug', 'log', 'verbose']
  });
  // TODO: fix Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('/api');

  app.use(cookieParser());

  // Global Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  app.enableCors({
    origin: [],
    allowedHeaders: ['x-version', 'accept', 'origin', 'content-type', 'date', 'authorization'],
    credentials: true,
    maxAge: 86400,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
  });

  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log(
      `Listening at port ${port} in ${process.env.NODE_ENV} mode`
    );
  });
}

bootstrap();