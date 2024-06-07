import { Controller, Post, Body, Get, Query, Res, Req } from "@nestjs/common";
import { AuthService } from '../services/auth.service';
import { SupabaseService } from "../supabase/supabase.service";
import { AuthDto } from '../dto/auth.dto';
import { Response } from "express";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly supabaseService: SupabaseService) {}

    @Post('token')
    async receiveTokens(@Body() body: { accessToken: string, refreshToken: string }) {
        await this.supabaseService.handleSpotifyTokens(body.accessToken, body.refreshToken);
        return { message: 'Tokens received and processed' };
    }

    @Get('callback')
    async authCallback(
        @Query('access_token') accessToken: string,
        @Query('refresh_token') refreshToken: string,
        @Res() res: Response
    ) {
        console.log('Received Access Token:', accessToken);
        console.log('Received Refresh Token:', refreshToken);

        if (accessToken && refreshToken) {
            try {
                await this.authService.setSession(accessToken, refreshToken);
                res.redirect(303, 'http://localhost:4200/home');
            } catch (error) {
                console.error('Error setting session:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(400).send('Invalid token');
        }
    }

    @Get('oauth-signin')
    async signInWithSpotifyOAuth(@Res() res: Response) {
        try {
            const url = await this.supabaseService.signInWithSpotifyOAuth();
            res.redirect(303, url);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    @Post('signin')
    async signIn(@Body() authDto: AuthDto) {
        return this.authService.signIn(authDto);
    }

    @Post('signup')
    async signUp(@Body() body: { email: string; password: string; metadata: any }) {
        const { email, password, metadata } = body;
        return this.authService.signUp(email, password, metadata);
    }

    @Post('signout')
    async signOut() {
        return this.authService.signOut();
    }

    @Get('current')
    async getCurrentUser() {
        return this.authService.getCurrentUser();
    }

    @Post('spotifyUser')
    async getSpotifyUser(@Body() body: { token: string }) {
        const { token } = body;
        return this.authService.getSpotifyUser(token);
    }
}