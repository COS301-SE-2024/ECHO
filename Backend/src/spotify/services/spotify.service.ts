import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { createSupabaseClient } from "../../supabase/services/supabaseClient";
import { SupabaseService } from "../../supabase/services/supabase.service";
import { accessKey } from "../../config";

@Injectable()
export class SpotifyService
{
	constructor(private httpService: HttpService, private supabaseService: SupabaseService)
	{
	}

	// This function retrieves the provider token from the Supabase user_tokens table
	protected async getAccessToken(accessToken: string, refreshToken: string): Promise<string>
	{
		try
		{
			const supabase = createSupabaseClient();
			supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
			const { data, error: userError } = await supabase.auth.getUser();

			if (!data || !data.user)
			{
				console.error("User data is null:", { data, userError });
				throw new HttpException("No user data available", HttpStatus.UNAUTHORIZED);
			}

			const userId = data.user.id;
			const { providerToken } = await this.supabaseService.retrieveTokens(userId);
			return providerToken;
		}
		catch (error)
		{
			console.error("Error retrieving provider tokens:", error);
			throw new HttpException("Failed to retrieve provider tokens", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// This function retrieves the access key (for the Clustering recommendations) from the config file
	private async getAccessKey(): Promise<string>
	{
		try
		{
			return accessKey;
		}
		catch (error)
		{
			console.error("Error retrieving access key:", error);
			throw new HttpException("Failed to retrieve access key", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// This function retrieves the currently playing track from the Spotify API
	async getCurrentlyPlayingTrack(accessToken: string, refreshToken: string): Promise<any>
	{
		const providerToken = await this.getAccessToken(accessToken, refreshToken);
		const response = this.httpService.get("https://api.spotify.com/v1/me/player/currently-playing", {
			headers: { "Authorization": `Bearer ${providerToken}` }
		});
		return lastValueFrom(response).then(res => res.data);
	}

	// This function retrieves the recently played tracks from the Spotify API
	async getRecentlyPlayedTracks(accessToken: string, refreshToken: string): Promise<any>
	{
		const providerToken = await this.getAccessToken(accessToken, refreshToken);
		const response = this.httpService.get("https://api.spotify.com/v1/me/player/recently-played?limit=15", {
			headers: { "Authorization": `Bearer ${providerToken}` }
		});
		return lastValueFrom(response).then(res => res.data);
	}

	// This function retrieves the recommended tracks from the Echo API (Clustering recommendations)
	async getQueue(artist: string, song_name: string, accessToken, refreshToken): Promise<any>
	{
		const accessKey = await this.getAccessKey();
		const response = await lastValueFrom(
			this.httpService.post(
				"https://echo-capstone-func-app.azurewebsites.net/api/get_songs",
				{
					access_key: accessKey,
					artist: artist,
					song_name: song_name
				},
				{
					headers: { "Content-Type": "application/json" }
				}
			)
		);

		const tracks = response.data.recommended_tracks;

		const trackIds = tracks
			.map(track => track.track_uri.split(":").pop())
			.join(",");

		return this.fetchSpotifyTracks(trackIds, accessToken, refreshToken);

	}

	// This function fetches the tracks from the Spotify API based on the given trackIDs (a string of comma-delimited track IDs)
	private async fetchSpotifyTracks(trackIds: string, accessToken: string, refreshToken: string): Promise<any>
	{
		const providerToken = await this.getAccessToken(accessToken, refreshToken);
		const response = await lastValueFrom(
			this.httpService.get(
				`https://api.spotify.com/v1/tracks?ids=${trackIds}`,
				{
					headers: {
						"Authorization": `Bearer ${providerToken}`,
						"Content-Type": "application/json"
					}
				}
			)
		);

		return response.data;
	}

	// This function plays the track with the given trackID on the device with the given deviceID
	async playTrackById(trackId: string, deviceId: string, accessToken: string, refreshToken: string): Promise<any>
	{
		const providerToken = await this.getAccessToken(accessToken, refreshToken);
		const response = this.httpService.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
			uris: [`spotify:track:${trackId}`]
		}, {
			headers: {
				"Authorization": `Bearer ${providerToken}`,
				"Content-Type": "application/json"
			}
		});
		return response.subscribe(response => response.data);
	}

	// This function pauses the currently playing track
	async pause(accessToken, refreshToken): Promise<any>
	{
		const providerToken = await this.getAccessToken(accessToken, refreshToken);
		const response = this.httpService.put("https://api.spotify.com/v1/me/player/pause", {}, {
			headers: { "Authorization": `Bearer ${providerToken}` }
		});
		return response.subscribe(response => response.data);
	}

	// This function resumes the currently paused track
	async play(accessToken, refreshToken): Promise<any>
	{
		const providerToken = await this.getAccessToken(accessToken, refreshToken);
		const response = this.httpService.put("https://api.spotify.com/v1/me/player/play", {}, {
			headers: { "Authorization": `Bearer ${providerToken}` }
		});
		return response.subscribe(response => response.data);
	}

	// This function sets the volume of the player to the given volume
	async setVolume(volume: number, accessToken, refreshToken): Promise<any>
	{
		const providerToken = await this.getAccessToken(accessToken, refreshToken);
		const response = this.httpService.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {}, {
			headers: { "Authorization": `Bearer ${providerToken}` }
		});
		return response.subscribe(response => response.data);
	}

	// This function retrieves the details of the track with the given trackID
	async getTrackDetails(trackID: string, accessToken, refreshToken)
	{
		try
		{
			const providerToken = await this.getAccessToken(accessToken, refreshToken);
			const response = this.httpService.get(`https://api.spotify.com/v1/tracks/${trackID}`, {
				headers: { "Authorization": `Bearer ${providerToken}` }
			});

			if (!response)
			{
				throw new Error(`HTTP error!`);
			}

			return lastValueFrom(response).then(res => res.data);
		}
		catch (error)
		{
			console.error("Error fetching track details:", error);
			throw error;
		}
	}

	// This function extracts the relevant track information from the Spotify API response
	private extractSongs(data: any): TrackInfo[]
	{
		return data.tracks.map(track => ({
			id: track.id,
			name: track.name,
			albumName: track.album.name,
			albumImageUrl: track.album.images[0]?.url,
			artistName: track.artists[0]?.name,
			previewUrl: track.preview_url,
			spotifyUrl: track.external_urls.spotify
		}));
	}

	//This function plays the next track on the device with the given deviceID using the Spotify API
	async playNextTrack(accessToken: string, refreshToken: string, deviceId: string)
	{
		try
		{
			const providerToken = await this.getAccessToken(accessToken, refreshToken);

			await firstValueFrom(this.httpService.post("https://api.spotify.com/v1/me/player/next", null, {
				headers: {
					"Authorization": `Bearer ${providerToken}`
				},
				params: {
					"device_id": deviceId
				}
			}));

			return { message: "Skipped to next track successfully" };

		}
		catch (error)
		{
			console.error("Error playing next track:", error.response?.data || error.message);
			throw new HttpException("Failed to play next track", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	//This function plays the previous track on the device with the given deviceID using the Spotify API
	async playPreviousTrack(accessToken: string, refreshToken: string, deviceId: string)
	{
		try
		{
			const providerToken = await this.getAccessToken(accessToken, refreshToken);

			await firstValueFrom(this.httpService.post("https://api.spotify.com/v1/me/player/previous", null, {
				headers: {
					"Authorization": `Bearer ${providerToken}`
				},
				params: {
					"device_id": deviceId
				}
			}));

			return { message: "Switched to previous track successfully" };

		}
		catch (error)
		{
			console.error("Error playing previous track:", error.response?.data || error.message);
			throw new HttpException("Failed to play next track", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	//This function retrieves the track duration of the currently playing track using the Spotify API
	public async getTrackDuration(accessToken: string, refreshToken: string): Promise<number>
	{
		if (!accessToken)
		{
			throw new HttpException("Access token is missing while attempting to fetch track duration", HttpStatus.BAD_REQUEST);
		}
		try
		{
			const providerToken = await this.getAccessToken(accessToken, refreshToken);
			const response = await lastValueFrom(
				this.httpService.get("https://api.spotify.com/v1/me/player/currently-playing", {
					headers: {
						"Authorization": `Bearer ${providerToken}`
					}
				})
			);

			if (response.data && response.data.item && response.data.item.duration_ms)
			{
				return response.data.item.duration_ms;
			}
			else
			{
				throw new Error("Unable to fetch track duration");
			}
		}
		catch (error)
		{
			console.error("Error fetching track duration:", error.response?.data || error.message);
			throw new HttpException("Error fetching track duration", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async seekToPosition(accessToken: string, refreshToken: string, position_ms: number, deviceId: string): Promise<any>
	{
		try
		{
			const providerToken = await this.getAccessToken(accessToken, refreshToken);
			const response = await lastValueFrom(
				this.httpService.put(
					"https://api.spotify.com/v1/me/player/seek",
					null,
					{
						params: {
							position_ms,
							device_id: deviceId
						},
						headers: {
							"Authorization": `Bearer ${providerToken}`
						}
					}
				)
			);

			if (response.status === 204)
			{
				return { message: "Seek position updated successfully" };
			}
			else
			{
				throw new HttpException("Failed to update seek position", HttpStatus.BAD_REQUEST);
			}
		}
		catch (error)
		{
			console.error("Error seeking to position:", error.response?.data || error.message);
			throw new HttpException("Error seeking to position", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// This function adds the track with the given artist and song name to user's the queue
	async addToQueue(uri: string, device_id: string, accessToken: string, refreshToken: string)
	{
		try
		{
			const providerToken = await this.getAccessToken(accessToken, refreshToken);
			const response = await lastValueFrom(
				this.httpService.post(
					"https://api.spotify.com/v1/me/player/queue",
					null,
					{
						params: {
							uri: uri,
							device_id: device_id
						},
						headers: {
							"Authorization": `Bearer ${providerToken}`
						}
					}
				)
			);

			if (response.status === 204)
			{
				return { message: "Song added to queue successfully" };
			}
			else
			{
				throw new HttpException("Failed to add Song to queue", HttpStatus.BAD_REQUEST);
			}
		}
		catch (error)
		{
			console.error("Error adding to queue:", error.response?.data || error.message);
			throw new HttpException("Error adding to queue.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// This function retrieves the details of a track by it's name and artist
	async getTrackDetailsByName(
		artistName: string,
		trackName: string,
		accessToken: string,
		refreshToken: string
	): Promise<TrackInfo>
	{
		try
		{
			const providerToken = await this.getAccessToken(accessToken, refreshToken);

			const searchResponse = await lastValueFrom(
				this.httpService.get(
					`https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(artistName)}%20track:${encodeURIComponent(trackName)}&type=track&limit=1`,
					{
						headers: { Authorization: `Bearer ${providerToken}` }
					}
				)
			);

			const tracks = searchResponse.data.tracks.items;
			const track = tracks[0];

			const trackResponse = await lastValueFrom(
				this.httpService.get(`https://api.spotify.com/v1/tracks/${track.id}`, {
					headers: { Authorization: `Bearer ${providerToken}` }
				})
			);

			const trackData = trackResponse.data;
			const trackInfo: TrackInfo = {
				id: trackData.id,
				name: trackData.name,
				albumName: trackData.album.name,
				albumImageUrl: trackData.album.images[0]?.url || "",
				artistName: trackData.artists[0]?.name || "",
				previewUrl: trackData.preview_url || "",
				spotifyUrl: trackData.external_urls.spotify || ""
			};

			return trackInfo;
		}
		catch (error)
		{
			console.error("Error fetching track details:", error);
			throw error;
		}
	}

	// This function retrieves the analysis of a track by it's ID
	async getTrackAnalysis(trackId: string, accessToken: string, refreshToken: string)
	{
		try
		{
			const providerToken = await this.getAccessToken(accessToken, refreshToken);
			const audioFeaturesResponse = await lastValueFrom(
				this.httpService.get(
					`https://api.spotify.com/v1/audio-features/${trackId}`,
					{
						headers: { Authorization: `Bearer ${providerToken}` }
					}
				)
			);

			const audioFeatures = audioFeaturesResponse.data;
			const trackAnalysis: TrackAnalysis = {
				valence: audioFeatures.valence,
				energy: audioFeatures.energy,
				danceability: audioFeatures.danceability,
				tempo: audioFeatures.tempo
			};

			return trackAnalysis;
		}
		catch (error)
		{
			console.error("Error fetching track analysis:", error);
		}

	}

	// This function retrieves the top tracks of the user from the Spotify API
	async getTopTracks(accessToken: string, refreshToken: string): Promise<TrackInfo[]> {
		try {
			const providerToken = await this.getAccessToken(accessToken, refreshToken);

			const response = await lastValueFrom(
				this.httpService.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
					headers: { Authorization: `Bearer ${providerToken}` },
				})
			);

			return response.data.items.map(item => ({
				id: item.id,
				name: item.name,
				albumName: item.album.name,
				albumImageUrl: item.album.images[0]?.url,
				artistName: item.artists[0]?.name,
				previewUrl: item.preview_url,
				spotifyUrl: item.external_urls.spotify,
			}));
		} catch (error) {
			console.error('Error fetching top tracks:', error);
		}
	}

	// This function retrieves the top artists of the user from the Spotify API
	async getTopArtists(accessToken: string, refreshToken: string): Promise<ArtistInfo[]> {
		try {
			const providerToken = await this.getAccessToken(accessToken, refreshToken);

			const response = await lastValueFrom(
				this.httpService.get('https://api.spotify.com/v1/me/top/artists?limit=10', {
					headers: { Authorization: `Bearer ${providerToken}` },
				})
			);

			return response.data.items.map(item => ({
				id: item.id,
				name: item.name,
				imageUrl: item.images[0]?.url,
				spotifyUrl: item.uri,
			}));
		} catch (error) {
			console.error('Error fetching top artists:', error);
		}
	}
}

interface TrackInfo
{
	id: string;
	name: string;
	albumName: string;
	albumImageUrl: string;
	artistName: string;
	previewUrl: string;
	spotifyUrl: string;
}

interface ArtistInfo
{
	id: string;
	name: string;
	imageUrl: string;
	spotifyUrl: string;
}

interface TrackAnalysis {
	valence: number;
	energy: number;
	danceability: number;
	tempo: number;
}

