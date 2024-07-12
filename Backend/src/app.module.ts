import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth/controller/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { SupabaseService } from './supabase/services/supabase.service';
import { TokenMiddleware } from './middleware/token.middleware';
import { SpotifyController } from './spotify/controller/spotify.controller';
import { SpotifyService } from './spotify/services/spotify.service';
import { YoutubeController } from "./youtube/controller/youtube.controller";
import { YoutubeService } from "./youtube/services/youtube.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        HttpModule, // Include HttpModule here
    ],
    controllers: [AuthController, SpotifyController, YoutubeController],
    providers: [AuthService, SupabaseService, ConfigService, SpotifyService, YoutubeService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TokenMiddleware).forRoutes({ path: 'auth/callback', method: RequestMethod.GET });
    }
}
