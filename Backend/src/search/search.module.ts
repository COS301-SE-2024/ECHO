import { Module } from "@nestjs/common";
import { SearchService } from "./services/search.service";
import { SearchController } from "./controller/search.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [SearchService],
    controllers: [SearchController],
})
export class SpotifyModule {}