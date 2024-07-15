import { Body, Controller, Post } from "@nestjs/common";
import { YoutubeService } from "../services/youtube.service";

@Controller('youtube')
export class YoutubeController {
    constructor(private readonly youtubeService: YoutubeService) {}

    // This endpoint is used to get suggested tracks from the ECHO API (Clustering recommendations).
    @Post('queue')
    async getQueue(@Body() body: { artist: string; song_name: string}): Promise<any> {
        const { artist, song_name } = body;
        return await this.youtubeService.getQueue(artist, song_name);
    }

    @Post('track-details')
    async getTrackDetails(@Body() body: { videoId: string }): Promise<any> {
        const { videoId } = body;
        return await this.youtubeService.fetchSingleTrackDetails(videoId);
    }


}
