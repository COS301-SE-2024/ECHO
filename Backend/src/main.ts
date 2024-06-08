import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.enableCors({
        origin: configService.get('CORS_ORIGIN', 'http://localhost:4200'),
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    });

    app.setGlobalPrefix('api');

    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
