import { Module } from "@nestjs/common";
import { SpotifyService } from "../services/spotify.service";
import { SpotifyController } from "../controllers/spotify.controller";

@Module({
    providers: [SpotifyService],
    controllers: [SpotifyController],
})
export class SpotifyModule {}