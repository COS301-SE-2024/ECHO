import { Controller, Get, Query } from '@nestjs/common';
import { MusicService } from '../services/music.service';

@Controller('music')
export class MusicController {
    constructor(private readonly musicService: MusicService) {}

    @Get('similar-songs')
    async getSimilarSongs(@Query('songName') songName: string, @Query('artistName') artistName: string) {
        return this.musicService.getSimilarSongs(songName, artistName);
    }
}