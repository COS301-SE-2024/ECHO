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
	async convertApiResponseToSong(apiResponse: any): Promise<Track[]>
	{
		return apiResponse.data.map(item => ({
			name: item.title,
			albumName: item.album.title,
			albumImageUrl: item.album.cover_big,
			artistName: item.artist.name
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
}

interface Track
{
	name: string;
	albumName: string;
	albumImageUrl: string;
	artistName: string;
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