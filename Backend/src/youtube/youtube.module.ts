import { Module } from "@nestjs/common";
import { YoutubeService } from "./services/youtube.service";
import { YoutubeController } from "./controller/youtube.controller";
import { HttpModule } from "@nestjs/axios";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
    imports: [HttpModule, SupabaseModule],
    providers: [YoutubeService],
    controllers: [YoutubeController],
})
export class YoutubeModule {}