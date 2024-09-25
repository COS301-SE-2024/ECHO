import { Module } from "@nestjs/common";
import { YouTubeService } from "./services/youtube.service";
import { YouTubeController } from "./controller/youtube.controller";
import { HttpModule } from "@nestjs/axios";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
    imports: [HttpModule, SupabaseModule],
    providers: [YouTubeService],
    controllers: [YouTubeController],
})
export class YoutubeModule {}