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

    private async getAccessKey(): Promise<string> {
        try {
            return accessKey;
        } catch (error) {
            console.error("Error retrieving access key:", error);
            throw new HttpException("Failed to retrieve access key", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCurrentlyPlayingTrack(accessToken: string, refreshToken: string): Promise<any> {
        const providerToken = await this.getAccessToken(accessToken, refreshToken);
        const response = this.httpService.get("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: { "Authorization": `Bearer ${providerToken}` }
        });
        return lastValueFrom(response).then(res => res.data);
    }

    async getRecentlyPlayedTracks(accessToken: string, refreshToken: string): Promise<any> {
        const providerToken = await this.getAccessToken(accessToken, refreshToken);
        const response = this.httpService.get("https://api.spotify.com/v1/me/player/recently-played?limit=15", {
            headers: { "Authorization": `Bearer ${providerToken}` }
        });
        return lastValueFrom(response).then(res => res.data);
    }

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

    async pause(accessToken, refreshToken): Promise<any> {
        const providerToken = await this.getAccessToken(accessToken, refreshToken);
        const response = this.httpService.put("https://api.spotify.com/v1/me/player/pause", {}, {
            headers: { "Authorization": `Bearer ${providerToken}` }
        });
        return response.subscribe(response => response.data);
    }

    async play(accessToken, refreshToken): Promise<any> {
        const providerToken = await this.getAccessToken(accessToken, refreshToken);
        const response = this.httpService.put("https://api.spotify.com/v1/me/player/play", {}, {
            headers: { "Authorization": `Bearer ${providerToken}` }
        });
        return response.subscribe(response => response.data);
    }

    async setVolume(volume: number, accessToken, refreshToken): Promise<any> {
        const providerToken = await this.getAccessToken(accessToken, refreshToken);
        const response = this.httpService.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {}, {
            headers: { "Authorization": `Bearer ${providerToken}` }
        });
        return response.subscribe(response => response.data);
    }

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
