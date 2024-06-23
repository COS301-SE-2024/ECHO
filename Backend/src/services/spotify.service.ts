import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { supabase } from "../lib/supabaseClient";
import { SupabaseService } from "../supabase/supabase.service";
import { accessKey } from "../config";

@Injectable()
export class SpotifyService {
    constructor(private httpService: HttpService, private supabaseService: SupabaseService) {
    }

    protected async getAccessToken(): Promise<string> {
        try {
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

    async getCurrentlyPlayingTrack(): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.get("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        return lastValueFrom(response).then(res => res.data);
    }

    async getRecentlyPlayedTracks(): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.get("https://api.spotify.com/v1/me/player/recently-played", {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        return lastValueFrom(response).then(res => res.data);
    }

    async getQueue(artist: string, song_name: string): Promise<any> {
        const accessKey = await this.getAccessKey();
        console.log("Access key: ", accessKey, artist, song_name)
        const response = await lastValueFrom(
            this.httpService.post("https://echo-capstone-func-app.azurewebsites.net/api/get_songs", {
                params: {
                    access_key: accessKey,
                    artist: artist,
                    song_name: song_name
                }
            })
        );

        const tracks = response.data.recommended_tracks;

        const trackIds = tracks
            .map(track => track.track_uri.split(":").pop())
            .join(",");

        return trackIds;
    }

    async playTrackById(trackId: string, deviceId: string): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            uris: [`spotify:track:${trackId}`]
        }, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
        return response.subscribe(response => response.data);
    }

    async pause(): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.put("https://api.spotify.com/v1/me/player/pause", {}, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        return response.subscribe(response => response.data);
    }

    async play(): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.put("https://api.spotify.com/v1/me/player/play", {}, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        return response.subscribe(response => response.data);
    }

    async setVolume(volume: number): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {}, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        return response.subscribe(response => response.data);
    }

    async getTrackDetails(trackID: string) {
        try {
            const accessToken = await this.getAccessToken();
            const response = this.httpService.get(`https://api.spotify.com/v1/tracks/${trackID}`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
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
}
