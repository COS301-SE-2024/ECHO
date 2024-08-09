import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, UnauthorizedException } from "@nestjs/common";
import { SpotifyService } from "../services/spotify.service";

@Controller('spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) {}

    // This endpoint is used to get the currently playing track from the Spotify API.
    @Post('currently-playing')
    async getCurrentlyPlayingTrack(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        if (!body.accessToken || !body.refreshToken) {
            throw new HttpException('Access token or refresh token is missing while attempting to retrieve the currently playing song from Spotify.', HttpStatus.UNAUTHORIZED);
        }
        const {accessToken,refreshToken} = body;
        return await this.spotifyService.getCurrentlyPlayingTrack(accessToken,refreshToken);
    }

    // This endpoint is used to get the recently played tracks from the Spotify API.
    @Post('recently-played')
    async getRecentlyPlayedTracks(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        if (!body.accessToken || !body.refreshToken) {
            throw new UnauthorizedException('Access token or refresh token is missing while attempting to retrieve recently played songs from Spotify.');
        }

        const {accessToken,refreshToken} = body;
        return await this.spotifyService.getRecentlyPlayedTracks(accessToken,refreshToken);
    }

    // This endpoint is used to get suggested tracks from the ECHO API (Clustering recommendations).
    @Post('queue')
    async getQueue(@Body() body: { artist: string; song_name: string, accessToken: string; refreshToken: string }): Promise<any> {
        if (!body.artist || !body.song_name || !body.accessToken || !body.refreshToken) {
            return { status: 'error', error: 'Artist, song name, access token or refresh token is missing while attempting to retrieve suggested songs from the ECHO API.' };
        }
        const { artist, song_name , accessToken,refreshToken} = body;
        return await this.spotifyService.getQueue(artist, song_name, accessToken,refreshToken);
    }

    // This endpoint is used to play a track by its ID on a specific device.
    @Put('play')
    async playTrackById(@Body() body: { trackId: string, deviceId: string,accessToken: string; refreshToken: string }): Promise<any> {
        if (!body.trackId || !body.deviceId || !body.accessToken || !body.refreshToken) {

        }
        const { trackId, deviceId,accessToken,refreshToken } = body;
        return await this.spotifyService.playTrackById(trackId, deviceId,accessToken,refreshToken);
    }

    // This endpoint is used to pause the currently playing track on a specific device.
    @Put('pause')
    async pause(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        if (!body.accessToken || !body.refreshToken) {
            throw new UnauthorizedException('Access token or refresh token is missing while attempting to pause the currently playing song from Spotify.');
        }
        const {accessToken,refreshToken} = body;
        return await this.spotifyService.pause(accessToken,refreshToken);
    }

    // This endpoint is used to resume the currently paused track on a specific device.
    @Put('resume')
    async play(@Body() body: { accessToken: string; refreshToken: string }): Promise<any> {
        if (!body.accessToken || !body.refreshToken) {
            throw new UnauthorizedException('Access token or refresh token is missing while attempting to resume the currently paused song from Spotify.');
        }
        const {accessToken,refreshToken} = body;
        return await this.spotifyService.play(accessToken,refreshToken);
    }

    // This endpoint is used to set the volume of a specific device.
    @Put('volume')
    async setVolume(@Body() body: { volume: number, accessToken: string; refreshToken: string }): Promise<any> {
        if (!body.volume || !body.accessToken || !body.refreshToken) {
            throw new UnauthorizedException('Volume, access token, or refresh token is missing while attempting to set the volume of a device from Spotify.');
        }
        const {volume,accessToken,refreshToken} = body;
        return await this.spotifyService.setVolume(volume,accessToken,refreshToken);
    }

    // This endpoint is used to get the details of a specific track.
    @Post('track-details')
    async getTrackDetails(@Body() body: { trackID: string, accessToken: string; refreshToken: string }): Promise<any> {
        if (!body.trackID || !body.accessToken || !body.refreshToken) {
            throw new UnauthorizedException('Track ID, access token, or refresh token is missing while attempting to retrieve the details of a track from Spotify.');
        }
        const {trackID,accessToken,refreshToken} = body;
        return await this.spotifyService.getTrackDetails(trackID,accessToken,refreshToken);
    }


    // This endpoint is used to play a track by it's name and artist on a specific device.
    @Post('play-by-name')
    async playTrackByName(@Body() body: { trackName: string, accessToken: string; refreshToken: string }): Promise<any> {
        const {trackName,accessToken,refreshToken} = body;
        return await this.spotifyService.getTrackDetails(trackName,accessToken,refreshToken);
    }

    // This endpoint is used to play the next track on a specific device.
    @Put('next-track')
    async playNextTrack(@Body() body: { accessToken: string; refreshToken: string; deviceId: string }): Promise<any> {
        if (!body.accessToken || !body.refreshToken || !body.deviceId) {
            throw new UnauthorizedException('Access token, refresh token, or device ID is missing while attempting to play the next song from Spotify.');
        }
        const {accessToken,refreshToken,deviceId} = body;
        return await this.spotifyService.playNextTrack(accessToken,refreshToken,deviceId);
    }

    // This endpoint is used to play the previous track on a specific device.
    @Put('previous-track')
    async playPreviousTrack(@Body() body: { accessToken: string; refreshToken: string; deviceId: string }): Promise<any> {
        if (!body.accessToken || !body.refreshToken || !body.deviceId) {
            throw new UnauthorizedException('Access token, refresh token, or device ID is missing while attempting to play the next song from Spotify.');
        }
        const {accessToken,refreshToken,deviceId} = body;
        return await this.spotifyService.playPreviousTrack(accessToken,refreshToken,deviceId);
    }

    // This endpoint is used to seek to a specific position in the currently playing track on a specific device.
    @Put('seek')
    async seekToPosition(@Body() body: { deviceId: string; progress: number; accessToken: string; refreshToken: string }) {
        if (!body.accessToken || !body.refreshToken || !body.deviceId) {
            throw new UnauthorizedException('Access token, refresh token, or device ID is missing while attempting to seek to a position with Spotify.');
        }

        const { deviceId, progress, accessToken, refreshToken } = body;

        const trackDurationMs = await this.spotifyService.getTrackDuration(accessToken, refreshToken);
        const position_ms = Math.floor((progress / 100) * trackDurationMs);

        return await this.spotifyService.seekToPosition(accessToken, refreshToken, position_ms, deviceId);
    }

    //This endpoint is used to add a song to the queue on spotify
    @Post('add-to-queue')
    async addToQueue(@Body() body: { uri: string, accessToken: string, refreshToken: string }): Promise<any> {
        if (!body.uri || !body.accessToken || !body.refreshToken) {
            return { status: 'error', error: 'Artist, song name, access token or refresh token is missing while attempting to retrieve suggested songs from the ECHO API.' };
        }
        const { uri , accessToken,refreshToken} = body;
        return await this.spotifyService.addToQueue(uri, accessToken,refreshToken);
    }
}
