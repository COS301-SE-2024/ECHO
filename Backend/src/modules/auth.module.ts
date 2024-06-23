import { Module } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { SupabaseModule } from "./supabase.module";

@Module({
    imports: [SupabaseModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
