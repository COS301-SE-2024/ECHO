import { Module } from "@nestjs/common";
import { SpotifyService } from "../services/spotify.service";
import { SpotifyController } from "../controllers/spotify.controller";
import { SupabaseService } from "../supabase/supabase.service";
import { HttpModule } from "@nestjs/axios";
import { SupabaseModule } from "./supabase.module";

@Module({
    imports: [HttpModule, SupabaseModule],
    providers: [SpotifyService, SupabaseService],
    controllers: [SpotifyController],
})
export class SpotifyModule {}