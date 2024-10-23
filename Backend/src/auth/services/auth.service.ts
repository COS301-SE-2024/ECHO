import { Injectable } from "@nestjs/common";
import { createSupabaseClient } from "../../supabase/services/supabaseClient";
import { AuthDto } from "../../dto/auth.dto";

export interface UserAuthInfo
{
    oAuth: boolean,
    providers: string[],
    currentProvider: string
}


@Injectable()
export class AuthService
{

    // This function is used to sign in a user with their email and password
    async signIn(authDto: AuthDto)
    {
        const { email, password } = authDto;
        const supabase = createSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error)
        {
            throw new Error(error.message);
        }
        return { user: data.user, session: data.session };
    }

    // This function is used to sign up a user with their email, password, and metadata
    async signUp(email: string, password: string, metadata: any)
    {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata }
        });

        if (error)
        {
            throw new Error(error.message);
        }

        return { user: data.user, session: data.session };
    }

    // This function is used to sign out a user
    async signOut(accessToken: any, refreshToken: any)
    {
        const supabase = createSupabaseClient();
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        const { error } = await supabase.auth.signOut();

        if (error)
        {
            throw new Error(error.message);
        }

        return { message: "Signed out successfully" };
    }

    // This function is used to get the current user object from Supabase
    async getCurrentUser(accessToken: string, refreshToken: any)
    {
        const supabase = createSupabaseClient();
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        const { data: { user } } = await supabase.auth.getUser();

        if (!user)
        {
            throw new Error("No user is signed in");
        }

        return { user };
    }

    async isOAuthUser(accessToken: string, refreshToken: string) : Promise<UserAuthInfo>
    {
        const supabase = createSupabaseClient();
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        const { data: { user } } = await supabase.auth.getUser();

        if (!user)
        {
            throw new Error("No user is signed in");
        }

        const providers = user.app_metadata.providers;
        const oAuth = providers.length > 0;
        const currentProvider = user.app_metadata.provider;

        return { oAuth, providers, currentProvider };
    }


    // This function is used to set the session for a user
    setSession(token: string, refresh_token: string)
    {
        const supabase = createSupabaseClient();
        return supabase.auth.setSession({ access_token: token, refresh_token: refresh_token });

    }

    // This function is used to get the provider of a user
    async getProvider(accessToken: string, refreshToken: string)
    {
        const supabase = createSupabaseClient();
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        const { data: { user } } = await supabase.auth.getUser();

        if (!user)
        {
            return {
                provider: "none",
                message: "No user logged in",
            };
        }

        return user.app_metadata.provider;
    }
}