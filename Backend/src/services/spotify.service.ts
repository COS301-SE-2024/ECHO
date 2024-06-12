// src/spotify/spotify.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AuthController } from "../controllers/auth.controller";
import { supabase } from "../lib/supabaseClient";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable()
export class SpotifyService {
    constructor(private httpService: HttpService, private supabaseService: SupabaseService) {}

    private async getAccessToken(): Promise<any> {
        try {
            const { data, error: userError } = await supabase.auth.getUser();

            if (!data || !data.user) {
                console.error('User data is null:', { data, userError });
                return { status: 'error', message: 'No user data available' };
            }

            const userId = data.user.id;
            const { providerToken, providerRefreshToken } = await this.supabaseService.retrieveTokens(userId);
            return { providerToken};
        } catch (error) {
            console.error('Error retrieving provider tokens:', error);
            return {status: 'error',message: 'Failed to retrieve provider tokens' };
        }
    }

    async getCurrentlyPlayingTrack(): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        return lastValueFrom(response).then(res => res.data);
    }

    async getRecentlyPlayedTracks(): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.get('https://api.spotify.com/v1/me/player/recently-played', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        return lastValueFrom(response).then(res => res.data);
    }

    async getRecommendations(seedTracks: string, market: string, limit: number): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.get(`https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks}&market=${market}&limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        return lastValueFrom(response).then(res => res.data);
    }

    async playTrackById(trackId: string): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.put(`https://api.spotify.com/v1/me/player/play`, {
            uris: [`spotify:track:${trackId}`],
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return lastValueFrom(response);
    }

    async pause(): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.put('https://api.spotify.com/v1/me/player/pause', {}, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        return lastValueFrom(response);
    }

    async play(): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.put('https://api.spotify.com/v1/me/player/play', {}, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        return lastValueFrom(response);
    }

    async setVolume(volume: number): Promise<any> {
        const accessToken = await this.getAccessToken();
        const response = this.httpService.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {}, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        return lastValueFrom(response);
    }
}
