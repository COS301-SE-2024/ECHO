import { Module, Logger, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { SupabaseService } from "./supabase/supabase.service";
import { TokenMiddleware } from './middleware/token.middleware';

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
        }),
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService, SupabaseService]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .forRoutes({ path: 'auth/callback', method: RequestMethod.GET });
    }
}


