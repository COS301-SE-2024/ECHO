import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { accessKey, youtubeKey } from "../../config";

export interface YouTubeTrackInfo {
    id: string;
    title: string;
    thumbnailUrl: string;
    channelTitle: string;
    videoUrl: string;
}

@Injectable()
export class YoutubeService {
    constructor(private httpService: HttpService) {}

    // This function retrieves the recommended tracks from the Echo API (Clustering recommendations)
    public async getQueue(artist: string, songName: string): Promise<YouTubeTrackInfo[]> {
        try {
            const response = await this.httpService.post<any>('https://echo-capstone-func-app.azurewebsites.net/api/get_songs', {
                access_key: accessKey,
                artist: artist,
                song_name: songName
            }, {
                headers: { 'Content-Type': 'application/json' }
            }).toPromise();

            const tracks = response.data.recommended_tracks;
            const trackDetails = tracks.map(track => ({
                title: track.track_details[0],
                artist: track.track_details[1]
            }));

            return this.fetchYoutubeTracks(trackDetails);
        } catch (error) {
            console.error('Error fetching queue:', error);
            throw new HttpException('Failed to fetch queue', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // This function retrieves the details of the tracks with the given videoId's
    private async fetchYoutubeTrackDetails(videoIds: string[]): Promise<YouTubeTrackInfo[]> {
        const videoIdsString = videoIds.join(',');
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIdsString}&key=${youtubeKey}`;

        try {
            const response = await lastValueFrom(
                this.httpService.get(url)
            );

            return response.data.items.map(item => ({
                id: item.id,
                title: item.snippet.title,
                thumbnailUrl: item.snippet.thumbnails.default.url,
                channelTitle: item.snippet.channelTitle,
                videoUrl: `https://www.youtube.com/watch?v=${item.id}`
            }));
        } catch (error) {
            console.error('Error fetching YouTube track details:', error);
            throw new HttpException('Failed to fetch YouTube track details', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // This function retrieves the details of a single track with the given videoId
    public async fetchSingleTrackDetails(videoId: string): Promise<YouTubeTrackInfo> {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${youtubeKey}`;

        try {
            const response = await lastValueFrom(
                this.httpService.get(url)
            );

            const item = response.data.items[0];
            return {
                id: item.id,
                title: item.snippet.title,
                thumbnailUrl: item.snippet.thumbnails.default.url,
                channelTitle: item.snippet.channelTitle,
                videoUrl: `https://www.youtube.com/watch?v=${item.id}`
            };
        } catch (error) {
            console.error('Error fetching YouTube track details:', error);
            throw new HttpException('Failed to fetch YouTube track details', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // This function fetches the tracks from the Youtube API based on the given track details
    private async fetchYoutubeTracks(trackDetails: { title: string, artist: string }[]): Promise<YouTubeTrackInfo[]> {
        const videoIds = await Promise.all(trackDetails.map(async (track) => {
            const query = `${track.title} ${track.artist}`;
            const encodedQuery = encodeURIComponent(query);
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodedQuery}&type=video&key=${youtubeKey}`;

            try {
                const searchResponse = await lastValueFrom(this.httpService.get(searchUrl));
                return searchResponse.data.items[0]?.id.videoId;
            } catch (error) {
                console.error('Error searching for YouTube video:', error);
                return null;
            }
        }));

        const validVideoIds = videoIds.filter(id => id !== null);
        return this.fetchYoutubeTrackDetails(validVideoIds);
    }
}