import { Controller, Post, Body, Get, Query, Res, Req, HttpStatus, HttpException } from "@nestjs/common";
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

    //This is the endpoint that the frontend will call to store the tokens from the provider
    @Post("token")
    async receiveTokens(@Body() body: {
        accessToken: string,
        refreshToken: string,
        providerToken: string,
        providerRefreshToken: string
    }) {
        if (!(body.accessToken && body.refreshToken && body.providerToken && body.providerRefreshToken)) {
            return { status: 'error', error: "Invalid tokens" };
        }
        await this.supabaseService.handleSpotifyTokens(body.accessToken, body.refreshToken, body.providerToken, body.providerRefreshToken);
        return { message: "Tokens received and processed" };
    }

    //This is the endpoint that the frontend will call to store the code from the provider
    @Post("code")
    async receiveCode(@Body() body: { code: string }) {
        const { code } = body;
        if (code === null)
        {
            return {status: 'error', error: "No code provided"};
        }
        await this.supabaseService.exchangeCodeForSession(code);
        return { message: "Code received and processed" };
    }

    //This is the endpoint that the frontend will call to get the provider tokens
    @Post("providertokens")
    async getProviderTokens(@Body() body: {accessToken: string, refreshToken: string}): Promise<any> {
        if (!(body.accessToken && body.refreshToken))
        {
            return { status: 'error', error: 'No access token or refresh token found in request.' };
        }

        try {
            const supabase = createSupabaseClient();
            await supabase.auth.setSession(body.accessToken, body.refreshToken);
            const { data, error: userError } = await supabase.auth.getUser(body.accessToken);

            if (userError) {
                throw userError;
            }

            if (!data || !data.user) {
                return { status: 'error', message: 'No user data available' };
            }

            const userId = data.user.id;
            const { providerToken, providerRefreshToken } = await this.supabaseService.retrieveTokens(userId);
            return { providerToken, providerRefreshToken };
        } catch (error) {
            return { status: 'error', message: 'Failed to retrieve provider tokens' };
        }
    }

    //This endpoint handles the callback from the provider
    @Get("callback")
    async authCallback(
        @Query("access_token") accessToken: string,
        @Query("refresh_token") refreshToken: string,
        @Res() res: Response
    ) {

        if (accessToken && refreshToken) {
            try {
                await this.authService.setSession(accessToken, refreshToken);
                res.redirect(303, "/home");
            } catch (error) {
                console.error("Error setting session:", error);
                res.status(500).send("Internal Server Error");
            }
        } else {
            res.status(400).send("Invalid token");
        }
    }

    //This endpoint is used to sign in with OAuth through a provider
    @Post("oauth-signin")
    async signInWithSpotifyOAuth(@Body() body: {provider: string}) {
        if (!body.provider) {
            return {status: 'error', error: "No provider specified" };
        }
        try {
            const url = await this.supabaseService.signinWithOAuth(body.provider);
            return { url };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    //This endpoint is used to sign in with email and password
    @Post("signin")
    async signIn(@Body() authDto: AuthDto) {
        if (!authDto.email || !authDto.password) {
            return { error: "Invalid email or password" };
        }
        return this.authService.signIn(authDto);
    }

    //This endpoint is used to sign up with email and password
    @Post("signup")
    async signUp(@Body() body: { email: string; password: string; metadata: any }) {
        const { email, password, metadata } = body;
        if (!email || !password) {
            return { status: 'error', error: "Invalid email or password" };
        }
        return this.authService.signUp(email, password, metadata);
    }

    //This endpoint is used to sign out
    @Post("signout")
    async signOut(@Body() body: {accessToken: string, refreshToken: string}) {
        if (!(body.accessToken && body.refreshToken))
        {
            return { status: 'error', error: "No access token or refresh token found in sign-out request." };
        }
        const {accessToken,refreshToken} = body;
        return this.authService.signOut(accessToken,refreshToken);
    }

    //This endpoint is used to get the current user
    @Post("current")
    async getCurrentUser(@Body() body: {accessToken: string, refreshToken: string}) {
        if (!(body.accessToken && body.refreshToken))
        {
            return { status: 'error', error: "No access token or refresh token provided when attempting to retrieve current user." };
        }
        const {accessToken,refreshToken} = body;
        return this.authService.getCurrentUser(accessToken,refreshToken);
    }

    //This endpoint is used to get the provider of a user
    @Get("provider")
    async getProvider(@Body() body: {accessToken: string, refreshToken: string}): Promise<{ provider: string; message: string } | string> {
        if (!(body.accessToken && body.refreshToken))
        {
            return { provider: "none", message: "No access token or refresh token found in request." };
        }
        const {accessToken,refreshToken} = body;
        return await this.authService.getProvider(accessToken,refreshToken);
    }
}