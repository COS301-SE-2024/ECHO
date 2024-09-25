import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    // Create Nest application
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Configure allowed origins for CORS from environment variable or default values
    const allowedOrigins = configService.get<string | string[]>('CORS_ORIGIN', [
        'http://localhost:4200',
        'https://echo-bm8z.onrender.com'
    ]);

    // Enable CORS with the allowed origins
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
