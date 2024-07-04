import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { createSupabaseClient } from "../../supabase/services/supabaseClient";
import { SupabaseService } from "../../supabase/services/supabase.service";
import { accessKey } from "../../config";

@Injectable()
export class SpotifyService {
    constructor(private httpService: HttpService, private supabaseService: SupabaseService) {
    }

    // This function retrieves the provider token from the Supabase user_tokens table
    protected async getAccessToken(accessToken: string, refreshToken: string): Promise<string> {
        try {
            const supabase = createSupabaseClient();
            supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
            const { data, error: userError } = await supabase.auth.getUser();

            if (!data || !data.user) {
                console.error("User data is null:", { data, userError });
                throw new HttpException("No user data available", HttpStatus.UNAUTHORIZED);
            }

            const userId = data.user.id;
            const { providerToken } = await this.supabaseService.retrieveTokens(userId);
            return providerToken;
        } catch (error) {
            console.error("Error retrieving provider tokens:", error);
            throw new HttpException("Failed to retrieve provider tokens", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // This function retrieves the access key (for the Clustering recommendations) from the config file
    private async getAccessKey(): Promise<string> {
        try {
            return accessKey;
        } catch (error) {
            console.error("Error retrieving access key:", error);
            throw new HttpException("Failed to retrieve access key", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // This function retrieves the currently playing track from the Spotify API
    async getCurrentlyPlayingTrack(accessToken: string, refreshToken: string): Promise<any> {
        const providerToken = await this.getAccessToken(accessToken, refreshToken);
        const response = this.httpService.get("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: { "Authorization": `Bearer ${providerToken}` }
        });
        return lastValueFrom(response).then(res => res.data);
    }

    // This function retrieves the recently played tracks from the Spotify API
    async getRecentlyPlayedTracks(accessToken: string, refreshToken: string): Promise<any> {
        const providerToken = await this.getAccessToken(accessToken, refreshToken);
        const response = this.httpService.get("https://api.spotify.com/v1/me/player/recently-played?limit=15", {
            headers: { "Authorization": `Bearer ${providerToken}` }
        });
        return lastValueFrom(response).then(res => res.data);
    }

    // This function retrieves the recommended tracks from the Echo API (Clustering recommendations)
    async getQueue(artist: string, song_name: string, accessToken, refreshToken): Promise<any> {
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
    private async fetchSpotifyTracks(trackIds: string, accessToken: string, refreshToken:string): Promise<any> {
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
    async playTrackById(trackId: string, deviceId: string, accessToken: string, refreshToken:string): Promise<any> {
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
    async pause(accessToken, refreshToken): Promise<any> {
        const providerToken = await this.getAccessToken(accessToken, refreshToken);
        const response = this.httpService.put("https://api.spotify.com/v1/me/player/pause", {}, {
            headers: { "Authorization": `Bearer ${providerToken}` }
        });
        return response.subscribe(response => response.data);
    }

    // This function resumes the currently paused track
    async play(accessToken, refreshToken): Promise<any> {
        const providerToken = await this.getAccessToken(accessToken, refreshToken);
        const response = this.httpService.put("https://api.spotify.com/v1/me/player/play", {}, {
            headers: { "Authorization": `Bearer ${providerToken}` }
        });
        return response.subscribe(response => response.data);
    }

    // This function sets the volume of the player to the given volume
    async setVolume(volume: number, accessToken, refreshToken): Promise<any> {
        const providerToken = await this.getAccessToken(accessToken, refreshToken);
        const response = this.httpService.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {}, {
            headers: { "Authorization": `Bearer ${providerToken}` }
        });
        return response.subscribe(response => response.data);
    }

    // This function retrieves the details of the track with the given trackID
    async getTrackDetails(trackID: string, accessToken, refreshToken) {
        try {
            const providerToken = await this.getAccessToken(accessToken, refreshToken);
            const response = this.httpService.get(`https://api.spotify.com/v1/tracks/${trackID}`, {
                headers: { "Authorization": `Bearer ${providerToken}` }
            });

            if (!response) {
                throw new Error(`HTTP error!`);
            }

            return lastValueFrom(response).then(res => res.data);
        } catch (error) {
            console.error("Error fetching track details:", error);
            throw error;
        }
    }

    // This function extracts the relevant track information from the Spotify API response
    private extractSongs(data: any): TrackInfo[] {
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

}

interface TrackInfo {
    id: string;
    name: string;
    albumName: string;
    albumImageUrl: string;
    artistName: string;
    previewUrl: string;
    spotifyUrl: string;
}
