import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, UnauthorizedException } from "@nestjs/common";
import { PlaylistService } from "../services/playlist.service";

@Controller("playlist")
export class SpotifyController
{
    constructor(private readonly playlistService: PlaylistService)
    {
    }
}
