// src/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { supabase } from '../lib/supabaseClient';

@Injectable()
export class SupabaseService {
    async signInWithSpotifyOAuth() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
                redirectTo: 'http://localhost:4200/auth/callback',
            },
        });
        if (error) {
            throw new Error(error.message);
        }
        return data.url;
    }
    async exchangeCodeForSession(code: string) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            throw new Error(error.message);
        }
    }

    async handleSpotifyTokens(accessToken: string, refreshToken: string) {
        const { error } = await supabase.auth.setSession({access_token: accessToken, refresh_token: refreshToken});
    }
}
