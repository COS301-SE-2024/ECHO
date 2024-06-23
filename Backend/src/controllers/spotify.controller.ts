import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { SpotifyService } from "../services/spotify.service";

@Controller('spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) {}

    @Get('currently-playing')
    async getCurrentlyPlayingTrack(): Promise<any> {
        return await this.spotifyService.getCurrentlyPlayingTrack();
    }

    @Get('recently-played')
    async getRecentlyPlayedTracks(): Promise<any> {
        return await this.spotifyService.getRecentlyPlayedTracks();
    }

    @Post('queue')
    async getQueue(@Body() body: { artist: string; song_name: string }): Promise<any> {
        const { artist, song_name } = body;
        return await this.spotifyService.getQueue(artist, song_name);
    }

    @Put('play')
    async playTrackById(@Body() body: { trackId: string, deviceId: string }): Promise<any> {
        const { trackId, deviceId } = body;
        return await this.spotifyService.playTrackById(trackId, deviceId);
    }

    @Put('pause')
    async pause(): Promise<any> {
        return await this.spotifyService.pause();
    }

    @Put('resume')
    async play(): Promise<any> {
        return await this.spotifyService.play();
    }

    @Put('volume')
    async setVolume(@Body() body: { volume: number }): Promise<any> {
        const { volume } = body;
        return await this.spotifyService.setVolume(volume);
    }

    @Post('track-details')
    async getTrackDetails(@Body() body: { trackID: string }): Promise<any> {
        return await this.spotifyService.getTrackDetails(body.trackID);
    }
}
