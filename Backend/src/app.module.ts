import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { SupabaseService } from './supabase/supabase.service';
import { TokenMiddleware } from './middleware/token.middleware';
import { SpotifyController } from './controllers/spotify.controller';
import { SpotifyService } from './services/spotify.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        HttpModule, // Include HttpModule here
    ],
    controllers: [AuthController, SpotifyController],
    providers: [AuthService, SupabaseService, ConfigService, SpotifyService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TokenMiddleware).forRoutes({ path: 'auth/callback', method: RequestMethod.GET });
    }
}
