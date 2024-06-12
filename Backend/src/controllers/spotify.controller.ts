import { Controller, Get, Put, Param, Query, Res, HttpStatus } from '@nestjs/common';
import { SpotifyService } from '../services/spotify.service';
import { Response } from 'express';

@Controller('spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) {}

    @Get('current-track')
    async getCurrentTrack(@Res() res: Response) {
        try {
            const data = await this.spotifyService.getCurrentlyPlayingTrack();
            res.json(data);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @Get('recently-played')
    async getRecentlyPlayed(@Res() res: Response) {
        try {
            const data = await this.spotifyService.getRecentlyPlayedTracks();
            res.json(data);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @Get('recommendations')
    async getRecommendations(@Query('seedTracks') seedTracks: string, @Query('market') market: string, @Query('limit') limit: number, @Res() res: Response) {
        try {
            const data = await this.spotifyService.getRecommendations(seedTracks, market, limit);
            res.json(data);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @Put('play/:trackId')
    async playTrackById(@Param('trackId') trackId: string, @Res() res: Response) {
        try {
            const data = await this.spotifyService.playTrackById(trackId);
            res.json(data);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @Put('pause')
    async pause(@Res() res: Response) {
        try {
            const data = await this.spotifyService.pause();
            res.json({ message: 'Playback paused' });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @Put('play')
    async play(@Res() res: Response) {
        try {
            const data = await this.spotifyService.play();
            res.json({ message: 'Playback resumed' });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @Put('volume')
    async setVolume(@Query('volume') volume: number, @Res() res: Response) {
        try {
            const data = await this.spotifyService.setVolume(volume);
            res.json({ message: `Volume set to ${volume}%` });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}
