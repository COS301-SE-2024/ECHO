import { Controller, Post, Body, Get, Query, Res, Req } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SupabaseService } from "../../supabase/services/supabase.service";
import { AuthDto } from "../../dto/auth.dto";
import { Response } from "express";
import { createSupabaseClient } from "../../supabase/services/supabaseClient";
import { accessKey } from "../../config";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly supabaseService: SupabaseService) {
    }

    @Post("token")
    async receiveTokens(@Body() body: {
        accessToken: string,
        refreshToken: string,
        providerToken: string,
        providerRefreshToken: string
    }) {
        await this.supabaseService.handleSpotifyTokens(body.accessToken, body.refreshToken, body.providerToken, body.providerRefreshToken);
        return { message: "Tokens received and processed" };
    }

    @Post("code")
    async receiveCode(@Body() body: { code: string }) {
        const { code } = body;
        await this.supabaseService.exchangeCodeForSession(code);
        return { message: "Code received and processed" };
    }

    @Post("providertokens")
    async getProviderTokens(@Body() body: {accessToken: string, refreshToken: string}): Promise<any> {
        try {
            const supabase = createSupabaseClient();
            await supabase.auth.setSession(body.accessToken, body.refreshToken);
            const { data, error: userError } = await supabase.auth.getUser(body.accessToken);

            if (!data || !data.user) {
                console.error('User data is null:', { data, userError });
                return { status: 'error', message: 'No user data available' };
            }

            const userId = data.user.id;
            const { providerToken, providerRefreshToken } = await this.supabaseService.retrieveTokens(userId);
            return { providerToken, providerRefreshToken };
        } catch (error) {
            console.error('Error retrieving provider tokens:', error);
            return { status: 'error', message: 'Failed to retrieve provider tokens' };
        }
    }


    @Get("callback")
    async authCallback(
        @Query("access_token") accessToken: string,
        @Query("refresh_token") refreshToken: string,
        @Res() res: Response
    ) {

        if (accessToken && refreshToken) {
            try {
                await this.authService.setSession(accessToken, refreshToken);
                res.redirect(303, "http://localhost:4200/home");
            } catch (error) {
                console.error("Error setting session:", error);
                res.status(500).send("Internal Server Error");
            }
        } else {
            res.status(400).send("Invalid token");
        }
    }

    @Get("oauth-signin")
    async signInWithSpotifyOAuth(@Res() res: Response) {
        try {
            const url = await this.supabaseService.signInWithSpotifyOAuth();
            res.redirect(303, url);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    @Post("signin")
    async signIn(@Body() authDto: AuthDto) {
        return this.authService.signIn(authDto);
    }

    @Post("signup")
    async signUp(@Body() body: { email: string; password: string; metadata: any }) {
        const { email, password, metadata } = body;
        return this.authService.signUp(email, password, metadata);
    }

    @Post("signout")
    async signOut(@Body() body: {accessToken: string, refreshToken: string}) {
        const {accessToken,refreshToken} = body;
        return this.authService.signOut(accessToken,refreshToken);
    }

    @Post("current")
    async getCurrentUser(@Body() body: {accessToken: string, refreshToken: string}) {
        const {accessToken,refreshToken} = body;
        return this.authService.getCurrentUser(accessToken,refreshToken);
    }

    @Post("spotifyUser")
    async getSpotifyUser(@Body() body: { token: string }) {
        const { token } = body;
        return this.authService.getSpotifyUser(token);
    }

    @Get("provider")
    async getProvider(@Body() body: {accessToken: string, refreshToken: string}): Promise<{ provider: string; message: string } | string> {
        const {accessToken,refreshToken} = body;
        return await this.authService.getProvider(accessToken,refreshToken);
    }
}