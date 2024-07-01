import { Injectable } from '@nestjs/common';
import { supabase } from '../lib/supabaseClient';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
    async signIn(authDto: AuthDto) {
        const { email, password } = authDto;
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            throw new Error(error.message);
        }

        return { user: data.user, session: data.session };
    }

    async signUp(email: string, password: string, metadata: any) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata },
        });

        if (error) {
            throw new Error(error.message);
        }

        return { user: data.user, session: data.session };
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }

        return { message: 'Signed out successfully' };
    }

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('No user is signed in');
        }

        return { user };
    }

    getSpotifyUser(token: string) {
        return Promise.resolve(undefined);
    }

    setSession(token: string, refresh_token: string) {
        return supabase.auth.setSession({access_token: token,refresh_token: refresh_token});

    }

    async getProvider() {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                provider: 'none' ,
                message: 'No user logged in'
            };
        }

        return user.app_metadata.provider;
    }
}