import { Controller, Post, Body, HttpException, HttpStatus } from "@nestjs/common";
import { InsightsService } from "../services/insights.service";

@Controller("insights")
export class InsightsController {
    constructor(private readonly insightsService: InsightsService) {}

    @Post("top-mood")
    async getTopMood(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getTopMood(accessToken, refreshToken, providerName);
    }

    @Post("total-listening-time")
    async getTotalListeningTime(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getTotalListeningTime(accessToken, refreshToken, providerName);
    }

    @Post("most-listened-artist")
    async getMostListenedArtist(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getMostListenedArtist(accessToken, refreshToken, providerName);
    }

    @Post("most-played-track")
    async getMostPlayedTrack(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getMostPlayedTrack(accessToken, refreshToken, providerName);
    }

    @Post("top-genre")
    async getTopGenre(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getTopGenre(accessToken, refreshToken, providerName);
    }

    @Post("average-song-duration")
    async getAverageSongDuration(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getAverageSongDuration(accessToken, refreshToken, providerName);
    }

    @Post("most-active-day")
    async getMostActiveDay(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getMostActiveDay(accessToken, refreshToken, providerName);
    }

    @Post("unique-artists-listened")
    async getUniqueArtistsListened(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getUniqueArtistsListened(accessToken, refreshToken, providerName);
    }

    @Post("listening-trends")
    async getListeningTrends(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getListeningTrends(accessToken, refreshToken, providerName);
    }

    @Post("weekly-playlist")
    async getWeeklyPlaylist(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getWeeklyPlaylist(accessToken, refreshToken, providerName);
    }

    @Post("most-listened-day")
    async getMostListenedDay(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getMostListenedDay(accessToken, refreshToken, providerName);
    }

    @Post("listening-over-time")
    async getListeningOverTime(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        return this.validateAndCallService(body, this.insightsService.getListeningOverTime);
    }

    @Post("artists-vs-tracks")
    async getArtistsVsTracks(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        return this.validateAndCallService(body, this.insightsService.getArtistsVsTracks);
    }

    @Post("recent-track-genres")
    async getRecentTrackGenres(@Body() body: { accessToken: string; refreshToken: string; providerName: string }) {
        return this.validateAndCallService(body, this.insightsService.getRecentTrackGenres);
    }

    private validateAndCallService(body: any, serviceMethod: Function) {
        const { accessToken, refreshToken, providerName } = body;
        if (!accessToken || !refreshToken || !providerName) {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return serviceMethod.call(this.insightsService, accessToken, refreshToken, providerName);
    }
}
