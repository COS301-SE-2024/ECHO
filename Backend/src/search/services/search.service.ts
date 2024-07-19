import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

@Injectable()
export class SearchService {

    constructor(private httpService: HttpService) {}

    private deezerApiUrl = 'https://api.deezer.com';

    async searchByTitle(title: string) {
        const response = this.httpService.get(`${this.deezerApiUrl}/search?q=${title}`);
        return await lastValueFrom(response).then(res => this.convertApiResponseToSong(res.data));
    }

    async searchByAlbum(title: string) {
        const response = this.httpService.get(`${this.deezerApiUrl}/search?q=album:${title}`);
        return await lastValueFrom(response).then(res => this.convertApiResponseToSong(res.data));
    }

    async convertApiResponseToSong(apiResponse: any): Promise<Track[]> {
        return apiResponse.data.map(item => ({
            name: item.title,
            albumName: item.album.title,
            albumImageUrl: item.album.cover_big,
            artistName: item.artist.name
        }));
    }

}

interface Track {
    name: string;
    albumName: string;
    albumImageUrl: string;
    artistName: string;
}