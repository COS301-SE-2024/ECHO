import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom, forkJoin } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class SearchService
{

    constructor(private httpService: HttpService)
    {
    }

    private deezerApiUrl = "https://api.deezer.com";

    // This function searches for tracks by title.
    async searchByTitle(title: string)
    {
        const response = this.httpService.get(`${this.deezerApiUrl}/search?q=${title}`);
        return await lastValueFrom(response).then(res => this.convertApiResponseToSong(res.data));
    }

    // This function searches for albums (but only returns their names and album art).
    async searchByAlbum(title: string)
    {
        const response = this.httpService.get(`${this.deezerApiUrl}/search?q=album:${title}`);
        return await lastValueFrom(response).then(res => this.convertApiResponseToSong(res.data));
    }

    // This function converts the API response to a Track object.
    async convertApiResponseToSong(apiResponse: any): Promise<TrackInfo[]> {
        return apiResponse.data.slice(0, 10).map((item) => ({
            id: item.id,
            text: item.title,
            albumName: item.album.title,
            imageUrl: item.album.cover_big,
            secondaryText: item.artist.name,
            previewUrl: item.preview,
            spotifyUrl: item.link,
            explicit: item.explicit_lyrics
        }));
    }


    // This function converts the API response to an ArtistInfo object.
    async convertApiResponseToArtistInfo(artistData: any, topTracksData: any, albumsData: any): Promise<ArtistInfo>
    {
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

    // This function searches for an artist by name.
    async artistSearch(artist: string): Promise<ArtistInfo>
    {
        const searchResponse = this.httpService.get(`${this.deezerApiUrl}/search/artist?q=${artist}&limit=1`);
        const searchData = await lastValueFrom(searchResponse);

        if (searchData.data.data.length === 0)
        {
            throw new Error("Artist not found");
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

    // This function gets the details of a specific album.
    async searchAlbums(query: string): Promise<AlbumInfo | null>
    {
        const searchResponse = this.httpService.get(`${this.deezerApiUrl}/search/album?q=${query}&limit=1`);
        const searchData = await lastValueFrom(searchResponse);

        if (searchData.data.data.length === 0)
        {
            return null; // No albums found
        }

        const albumId = searchData.data.data[0].id;
        return this.getAlbumInfo(albumId);
    }

    // This function gets the details of a specific album by its ID.
    async getAlbumInfo(albumId: number): Promise<AlbumInfo>
    {
        const albumResponse = this.httpService.get(`${this.deezerApiUrl}/album/${albumId}`);
        const albumData = await lastValueFrom(albumResponse);
        return this.convertApiResponseToAlbumInfo(albumData.data);
    }

    // This function converts the API response to an AlbumInfo object.
    convertApiResponseToAlbumInfo(albumData: any): AlbumInfo
    {
        return {
            id: albumData.id,
            name: albumData.title,
            imageUrl: albumData.cover_big,
            artistName: albumData.artist.name,
            releaseDate: albumData.release_date,
            tracks: albumData.tracks.data.map(track => ({
                id: track.id,
                name: track.title,
                duration: track.duration,
                trackNumber: track.track_position,
                artistName: track.artist.name
            }))
        };
    }

    // This function fetches songs based on a given mood
    async getPlaylistSongsByMood(mood: string): Promise<{ imageUrl: string, tracks: Track[] }> {
        const moodMapping = {
            Neutral: "chill",
            Anger: "hard rock",
            Fear: "dark",
            Joy: "happy",
            Disgust: "grunge",
            Excitement: "dance",
            Love: "love songs",
            Sadness: "sad",
            Surprise: "surprising",
            Contempt: "metal",
            Shame: "soft rock",
            Guilt: "melancholic"
        };

        const searchQuery = moodMapping[mood] || "pop";
        const encodedQuery = encodeURIComponent(searchQuery);
        const response = this.httpService.get(`${this.deezerApiUrl}/search/playlist?q=${encodedQuery}`);

        const result = await lastValueFrom(response);

        if (result.data.data.length === 0) {
            throw new Error(`No playlists found for mood: ${mood}`);
        }

        const playlistId = result.data.data[0].id;
        const playlistResponse = this.httpService.get(`${this.deezerApiUrl}/playlist/${playlistId}`);
        const playlistData = await lastValueFrom(playlistResponse);

        return {
            imageUrl: playlistData.data.picture_big,  // Playlist cover image URL
            tracks: playlistData.data.tracks.data.map(track => ({
                name: track.title,
                albumName: track.album.title,
                albumImageUrl: track.album.cover_big,
                artistName: track.artist.name
            }))
        };
    }




    // This function fetches recommended moods and their respective songs
    async getSuggestedMoods(): Promise<{ mood: string; imageUrl: string; tracks: Track[] }[]> {
        const allMoods = [
            "Neutral", "Anger", "Fear", "Joy", "Disgust", "Excitement",
            "Love", "Sadness", "Surprise", "Contempt", "Shame", "Guilt"
        ];
        const suggestedMoods = allMoods.sort(() => 0.5 - Math.random()).slice(0, 5);
        const requests = suggestedMoods.map(mood => this.getPlaylistSongsByMood(mood));
        const results = await Promise.all(requests);

        return suggestedMoods.map((mood, index) => ({
            mood: mood,
            imageUrl: results[index].imageUrl,
            tracks: results[index].tracks
        }));
    }


}

interface Track
{
    name: string;
    albumName: string;
    albumImageUrl: string;
    artistName: string;
}

interface TrackInfo {
    id: string;
    text: string;
    albumName: string;
    imageUrl: string;
    secondaryText: string;
    previewUrl: string;
    spotifyUrl: string;
    explicit: boolean;
}


interface Album
{
    id: number;
    name: string;
    imageUrl: string;
    artistName: string;
}

interface ArtistInfo
{
    name: string;
    image: string;
    topTracks: Track[];
    albums: Album[];
}

interface AlbumTrack
{
    id: number;
    name: string;
    duration: number;
    trackNumber: number;
    artistName: string;
}

interface AlbumInfo extends Album
{
    releaseDate: string;
    tracks: AlbumTrack[];
}