import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { lastValueFrom, forkJoin } from "rxjs";

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

    async convertApiResponseToArtistInfo(artistData: any, topTracksData: any, albumsData: any): Promise<ArtistInfo> {
        return {
            name: artistData.name,
            image: artistData.picture_big,
            topTracks: topTracksData.data.slice(0, 5).map(track => ({
                name: track.title,
                albumName: track.album.title,
                albumImageUrl: track.album.cover_big,
                artistName: artistData.name
            })),
            albums: albumsData.data.slice(0, 5).map(album => ({
                name: album.title,
                imageUrl: album.cover_big
            }))
        };
    }

    async artistSearch(artist: string): Promise<ArtistInfo> {
        const searchResponse = this.httpService.get(`${this.deezerApiUrl}/search/artist?q=${artist}&limit=1`);
        const searchData = await lastValueFrom(searchResponse);

        if (searchData.data.data.length === 0) {
            throw new Error('Artist not found');
        }

        const artistId = searchData.data.data[0].id;

        const artistResponse = this.httpService.get(`${this.deezerApiUrl}/artist/${artistId}`);
        const topTracksResponse = this.httpService.get(`${this.deezerApiUrl}/artist/${artistId}/top?limit=5`);
        const albumsResponse = this.httpService.get(`${this.deezerApiUrl}/artist/${artistId}/albums?limit=5`);

        const [artistData, topTracksData, albumsData] = await lastValueFrom(forkJoin([
            artistResponse,
            topTracksResponse,
            albumsResponse
        ]));

        return this.convertApiResponseToArtistInfo(artistData.data, topTracksData.data, albumsData.data);
    }
}

interface Track {
    name: string;
    albumName: string;
    albumImageUrl: string;
    artistName: string;
}

interface Album {
    name: string;
    imageUrl: string;
}

interface ArtistInfo {
    name: string;
    image: string;
    topTracks: Track[];
    albums: Album[];
}