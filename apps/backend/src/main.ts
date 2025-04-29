import {
  INestApplication, // Import INestApplication for type hinting
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

class ApplicationServer {
  private app: INestApplication;
  private readonly port: number | string = process.env.PORT || 3333;
  private readonly logger = new Logger(ApplicationServer.name); // Instance logger

  // Public method to start the server
  async start(): Promise<void> {
    await this.createApp();
    this.configureVersioning();
    this.setGlobalPrefix();
    this.registerMiddleware();
    this.setupGlobalPipes();
    this.enableCors();
    await this.listen();
  }

  // Private method to create the NestJS application instance
  private async createApp(): Promise<void> {
    this.app = await NestFactory.create(AppModule, {
      // Use environment variable to determine logging level
      logger:
        process.env.NODE_ENV === 'production'
          ? ['warn', 'error']
          : ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    this.logger.log('Nest application instance created.');
  }

  // Private method to configure API versioning
  private configureVersioning(): void {
    // TODO: fix Versioning (Kept the original comment)
    this.app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1', // Consider making this configurable
    });
    this.logger.log('URI versioning enabled with default version "1".');
  }

  // Private method to set the global API prefix
  private setGlobalPrefix(): void {
    const prefix = '/api';
    this.app.setGlobalPrefix(prefix);
    this.logger.log(`Global prefix set to "${prefix}".`);
  }

  // Private method to register middleware
  private registerMiddleware(): void {
    this.app.use(cookieParser());
    this.logger.log('Cookie parser middleware registered.');
  }

  // Private method to set up global validation pipes
  private setupGlobalPipes(): void {
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strips properties that do not have any decorators
        forbidNonWhitelisted: true, // Throws an error if non-whitelisted values are provided
        transform: true, // Automatically transform payloads to DTO instances
        transformOptions: {
          enableImplicitConversion: true, // Convert query/path params based on TS type
        },
      })
    );
    this.logger.log('Global validation pipe configured.');
  }

  // Private method to configure CORS
  private enableCors(): void {
    const origin = process.env.CORS_ORIGIN?.split?.(',') || []; // IMPORTANT: Configure allowed origins for production!
    this.app.enableCors({
      origin,
      allowedHeaders: [
        'x-version',
        'accept',
        'origin',
        'content-type',
        'date',
        'authorization', // Common headers, adjust as needed
      ],
      credentials: true, // Allow cookies/auth headers to be sent
      maxAge: 86400, // Cache preflight requests for 1 day
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    });
    this.logger.log('CORS enabled: ' + origin.join(', '));
    // if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN.length === 0) {
    //   this.logger.warn(
    //     'CORS origin is not set or empty. This is insecure for production environments.'
    //   );
    // }
  }

  // Private method to start listening for incoming requests
  private async listen(): Promise<void> {
    await this.app.listen(this.port);
    const nodeEnv = process.env.NODE_ENV || 'development';
    this.logger.log(
      `Application is running on: ${await this.app.getUrl()} in ${nodeEnv} mode`
    );
    this.logger.log(`Listening at port ${this.port}`);
  }
}

// --- Application Entry Point ---

async function bootstrap() {
  try {
    const server = new ApplicationServer();
    await server.start();
  } catch (error) {
    Logger.error('Failed to bootstrap the application', error);
    process.exit(1);
  }
}

bootstrap();
