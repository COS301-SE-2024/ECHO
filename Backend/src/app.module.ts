import { Module, Logger, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { SupabaseService } from "./supabase/supabase.service";
import { TokenMiddleware } from './middleware/token.middleware';
import { MusicController } from "./controllers/music.controller";
import { MusicService } from "./services/music.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
    ],
    controllers: [AuthController, MusicController],
    providers: [AuthService, SupabaseService, MusicService, ConfigService]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .forRoutes({ path: 'auth/callback', method: RequestMethod.GET });
    }
}


