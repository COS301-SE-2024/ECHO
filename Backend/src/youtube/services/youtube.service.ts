import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

export interface TrackInfo
{
    id: string;
    name: string;
    albumName: string;
    albumImageUrl: string;
    artistName: string;
    previewUrl: string;
    youtubeId: string;
}

@Injectable()
export class YouTubeService
{
    private readonly API_URL = "https://www.googleapis.com/youtube/v3";
    private readonly API_KEY = process.env.YOUTUBE_KEY;

    constructor(private readonly httpService: HttpService)
    {
    }

    // This function will be used to map the YouTube API response to the TrackInfo interface.
    mapYouTubeResponseToTrackInfo(youtubeResponse: any): TrackInfo
    {
        return {
            id: youtubeResponse.id.videoId,
            name: youtubeResponse.snippet.title,
            albumName: youtubeResponse.snippet.album || "Unknown Album",
            albumImageUrl: youtubeResponse.snippet.thumbnails.high.url,
            artistName: youtubeResponse.snippet.channelTitle,
            previewUrl: "",
            youtubeId: youtubeResponse.id.videoId
        };
    }

    // This function will be used to search for videos/songs on YouTube.
    async searchVideos(query: string): Promise<TrackInfo[]>
    {
        const url = `${this.API_URL}/search?part=snippet&q=${encodeURIComponent(query)}&key=${this.API_KEY}`;
        const response = await this.httpService.get(url).toPromise();
        const items = response.data.items;

        return items.map((item: any) => this.mapYouTubeResponseToTrackInfo(item));
    }

    // This function will be used to retrieve details of a video/song on YouTube.
    async getVideoDetails(videoId: string): Promise<TrackInfo>
    {
        const url = `${this.API_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.API_KEY}`;
        const response = await this.httpService.get(url).toPromise();
        const item = response.data.items[0];

        return this.mapYouTubeResponseToTrackInfo(item);
    }

    // This function will be used to retrieve a YouTube API key.
    async getAPIKey()
    {
        return this.API_KEY;
    }
}
