import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    // Create Nest application
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Define allowed origins as an array
    const allowedOrigins = [
        'https://echo-bm8z.onrender.com',
        'http://localhost:4200'
    ];

    // Enable CORS with dynamic origin checking
    app.enableCors({
        origin: (origin, callback) => {
            // Allow requests with no origin, e.g., mobile apps or curl requests
            if (!origin) return callback(null, true);

            // Check if the origin is allowed
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
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
