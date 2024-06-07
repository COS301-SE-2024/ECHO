import { Module, Logger, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
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
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                Logger.log("Factory function called", "Database");
                const uri = configService.get<string>("MONGODB_URI");
                Logger.log(`MongoDB URI: ${uri}`, "Database");
                return { uri };
            },
            inject: [ConfigService]
        })
    ],
    controllers: [AuthController, MusicController],
    providers: [AuthService, SupabaseService, MusicService]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .forRoutes({ path: 'auth/callback', method: RequestMethod.GET });
    }
}


