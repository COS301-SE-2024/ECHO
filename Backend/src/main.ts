import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    // Create Nest application
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Enable CORS and configure origin from environment variable or default to localhost
    const allowedOrigins = configService.get<string[]>('CORS_ORIGIN', ['http://localhost:4200', 'http://127.0.0.1:8080']);
    app.enableCors({
        origin: allowedOrigins,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    });

    // Set global prefix for API
    app.setGlobalPrefix('api');

    // Use Render's assigned PORT environment variable, fallback to 3000 if not set
    const port = configService.get<number>('PORT', 3000);

    // Start the NestJS app
    await app.listen(port);

    // Log the application URL
    console.log(`Application is running on: ${await app.getUrl()}`);
}

// Bootstrap the application
bootstrap();