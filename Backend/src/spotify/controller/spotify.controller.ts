import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { SpotifyService } from "../services/spotify.service";

@Controller('spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) {}

    @Post('currently-playing')
    async getCurrentlyPlayingTrack(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        const {accessToken,refreshToken} = body;
        return await this.spotifyService.getCurrentlyPlayingTrack(accessToken,refreshToken);
    }

    @Post('recently-played')
    async getRecentlyPlayedTracks(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        const {accessToken,refreshToken} = body;
        return await this.spotifyService.getRecentlyPlayedTracks(accessToken,refreshToken);
    }

    @Post('queue')
    async getQueue(@Body() body: { artist: string; song_name: string, accessToken: string; refreshToken: string }): Promise<any> {
        const { artist, song_name , accessToken,refreshToken} = body;
        return await this.spotifyService.getQueue(artist, song_name, accessToken,refreshToken);
    }

    @Put('play')
    async playTrackById(@Body() body: { trackId: string, deviceId: string,accessToken: string; refreshToken: string }): Promise<any> {
        const { trackId, deviceId,accessToken,refreshToken } = body;
        return await this.spotifyService.playTrackById(trackId, deviceId,accessToken,refreshToken);
    }

    @Put('pause')
    async pause(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        const {accessToken,refreshToken} = body;
        return await this.spotifyService.pause(accessToken,refreshToken);
    }

    @Put('resume')
    async play(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        const {accessToken,refreshToken} = body;
        return await this.spotifyService.play(accessToken,refreshToken);
    }

    @Put('volume')
    async setVolume(@Body() body: { volume: number, accessToken: string; refreshToken: string }): Promise<any> {
        const {volume,accessToken,refreshToken} = body;
        return await this.spotifyService.setVolume(volume,accessToken,refreshToken);
    }

    @Post('track-details')
    async getTrackDetails(@Body() body: { trackID: string, accessToken: string; refreshToken: string }): Promise<any> {
        const {trackID,accessToken,refreshToken} = body;
        return await this.spotifyService.getTrackDetails(trackID,accessToken,refreshToken);
    }
}
