import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { SpotifyService } from "../services/spotify.service";

@Controller('spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) {}

    // This endpoint is used to get the currently playing track from the Spotify API.
    @Post('currently-playing')
    async getCurrentlyPlayingTrack(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        const {accessToken,refreshToken} = body;
        return await this.spotifyService.getCurrentlyPlayingTrack(accessToken,refreshToken);
    }

    // This endpoint is used to get the recently played tracks from the Spotify API.
    @Post('recently-played')
    async getRecentlyPlayedTracks(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        const {accessToken,refreshToken} = body;
        return await this.spotifyService.getRecentlyPlayedTracks(accessToken,refreshToken);
    }

    // This endpoint is used to get suggested tracks from the ECHO API (Clustering recommendations).
    @Post('queue')
    async getQueue(@Body() body: { artist: string; song_name: string, accessToken: string; refreshToken: string }): Promise<any> {
        const { artist, song_name , accessToken,refreshToken} = body;
        return await this.spotifyService.getQueue(artist, song_name, accessToken,refreshToken);
    }

    // This endpoint is used to play a track by its ID on a specific device.
    @Put('play')
    async playTrackById(@Body() body: { trackId: string, deviceId: string,accessToken: string; refreshToken: string }): Promise<any> {
        const { trackId, deviceId,accessToken,refreshToken } = body;
        return await this.spotifyService.playTrackById(trackId, deviceId,accessToken,refreshToken);
    }

    // This endpoint is used to pause the currently playing track on a specific device.
    @Put('pause')
    async pause(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        const {accessToken,refreshToken} = body;
        return await this.spotifyService.pause(accessToken,refreshToken);
    }

    // This endpoint is used to resume the currently paused track on a specific device.
    @Put('resume')
    async play(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        const {accessToken,refreshToken} = body;
        return await this.spotifyService.play(accessToken,refreshToken);
    }

    // This endpoint is used to set the volume of a specific device.
    @Put('volume')
    async setVolume(@Body() body: { volume: number, accessToken: string; refreshToken: string }): Promise<any> {
        const {volume,accessToken,refreshToken} = body;
        return await this.spotifyService.setVolume(volume,accessToken,refreshToken);
    }

    // This endpoint is used to get the details of a specific track.
    @Post('track-details')
    async getTrackDetails(@Body() body: { trackID: string, accessToken: string; refreshToken: string }): Promise<any> {
        const {trackID,accessToken,refreshToken} = body;
        return await this.spotifyService.getTrackDetails(trackID,accessToken,refreshToken);
    }

    // This endpoint is used to play a track by it's name and artist on a specific device.
    @Post('play-by-name')
    async playTrackByName(@Body() body: { trackName: string, accessToken: string; refreshToken: string }): Promise<any> {
        const {trackName,accessToken,refreshToken} = body;
        return await this.spotifyService.getTrackDetails(trackName,accessToken,refreshToken);
    }
}
