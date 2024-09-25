import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, UnauthorizedException } from "@nestjs/common";
import { PlaylistService } from "../services/playlist.service";

@Controller("playlist")
export class SpotifyController
{
    constructor(private readonly playlistService: PlaylistService)
    {
    }

    @Post("create")
    async createPlaylist(@Body() body: {playlistTracks: any; playlistName: string; accessToken: string; refreshToken: string;}): Promise<any>
    {
        return await this.playlistService.createPlaylist(body.playlistTracks, body.playlistName, body.accessToken, body.refreshToken);
    }
}
