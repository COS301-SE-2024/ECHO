import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const allowedOrigins = [
        'https://echo-bm8z.onrender.com',
        'http://localhost:4200',
        'https://pwa-test-ocl1.onrender.com'
    ];

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    });

    app.setGlobalPrefix('api');
    const port = process.env.PORT || configService.get<number>('PORT', 3000);
    await app.listen(port);

    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();