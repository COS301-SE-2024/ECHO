import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { YouTubeService } from "../services/youtube.service";

@Controller("youtube")
export class YouTubeController
{
    constructor(private readonly youtubeService: YouTubeService)
    {
    }

    // This endpoint will be used to search for videos/songs on YouTube.
    @Post("search")
    async search(@Body() body: { accessToken: string; refreshToken: string; query: string} )
    {
        if (!body.accessToken || !body.refreshToken)
        {
            throw new HttpException("Access token or refresh token is missing while attempting to search for a song using YouTube.", HttpStatus.UNAUTHORIZED);
        }
        if (!body.query)
        {
            throw new HttpException("Query is missing while attempting to search for videos on YouTube.", HttpStatus.BAD_REQUEST);
        }
        const result = await this.youtubeService.searchVideos(body.query);
        return result;
    }

    // This endpoint will be used to retrieve details of a video/song on YouTube.
    @Post("video")
    async getVideo(@Body() body: { accessToken: string; refreshToken: string; id: string})
    {
        if (!body.accessToken || !body.refreshToken)
        {
            throw new HttpException("Access token or refresh token is missing while attempting to retrieve a song's details on YouTube.", HttpStatus.UNAUTHORIZED);
        }
        if (!body.id)
        {
            throw new HttpException("Video ID is missing while attempting to retrieve video details from YouTube.", HttpStatus.BAD_REQUEST);
        }
        const result = await this.youtubeService.getVideoDetails(body.id);
        return result;
    }

    // This endpoint will be used to retrieve a YouTube API key.
    @Post("key")
    async getKey(@Body() body: { accessToken: string; refreshToken: string})
    {
        if (!body.accessToken || !body.refreshToken)
        {
            throw new HttpException("Access token or refresh token is missing while attempting to retrieve a YouTube API key.", HttpStatus.UNAUTHORIZED);
        }
        return await this.youtubeService.getAPIKey();
    }
}
