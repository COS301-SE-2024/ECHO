import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { SupabaseService } from '../../supabase/services/supabase.service';
import { createSupabaseClient } from '../../supabase/services/supabaseClient';
import { Response } from 'express';

jest.mock('../../supabase/services/supabaseClient');

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;
    let supabaseService: SupabaseService;

    beforeEach(async () => {
        const mockAuthService = {
            setSession: jest.fn(),
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getCurrentUser: jest.fn(),
            getProvider: jest.fn(),
        };

        const mockSupabaseService = {
            handleSpotifyTokens: jest.fn(),
            exchangeCodeForSession: jest.fn(),
            retrieveTokens: jest.fn(),
            signInWithSpotifyOAuth: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: SupabaseService, useValue: mockSupabaseService },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get(AuthService);
        supabaseService = module.get(SupabaseService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('receiveTokens', () => {
        it('should process received tokens', async () => {
            const tokens = {
                accessToken: 'access',
                refreshToken: 'refresh',
                providerToken: 'provider',
                providerRefreshToken: 'providerRefresh',
            };

            await controller.receiveTokens(tokens);

            expect(supabaseService.handleSpotifyTokens).toHaveBeenCalledWith(
                tokens.accessToken,
                tokens.refreshToken,
                tokens.providerToken,
                tokens.providerRefreshToken
            );
        });
    });

    describe('receiveCode', () => {
        it('should process received code', async () => {
            const code = 'authcode';

            await controller.receiveCode({ code });

            expect(supabaseService.exchangeCodeForSession).toHaveBeenCalledWith(code);
        });
    });

    describe('getProviderTokens', () => {
        it('should return provider tokens for a valid user', async () => {
            const mockSupabase = {
                auth: {
                    setSession: jest.fn(),
                    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user1' } }, error: null }),
                },
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            (supabaseService.retrieveTokens as jest.Mock ).mockResolvedValue({
                providerToken: 'pToken',
                providerRefreshToken: 'pRefreshToken',
            });

            const result = await controller.getProviderTokens({
                accessToken: 'access',
                refreshToken: 'refresh',
            });

            expect(result).toEqual({
                providerToken: 'pToken',
                providerRefreshToken: 'pRefreshToken',
            });
        });

        it('should handle errors when no user data is available', async () => {
            const mockSupabase = {
                auth: {
                    setSession: jest.fn(),
                    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
                },
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            const result = await controller.getProviderTokens({
                accessToken: 'access',
                refreshToken: 'refresh',
            });

            expect(result).toEqual({
                status: 'error',
                message: 'No user data available',
            });
        });

        it('should handle errors when getting user throws an error', async () => {
            const mockSupabase = {
                auth: {
                    setSession: jest.fn(),
                    getUser: jest.fn().mockRejectedValue(new Error('Failed to get user')),
                },
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            const result = await controller.getProviderTokens({
                accessToken: 'access',
                refreshToken: 'refresh',
            });

            expect(result).toEqual({
                status: 'error',
                message: 'Failed to retrieve provider tokens',
            });
        });
    })

    describe('authCallback', () => {
        it('should redirect on successful callback', async () => {
            const mockResponse = {
                redirect: jest.fn(),
            } as unknown as Response;

            await controller.authCallback('access', 'refresh', mockResponse);

            expect(authService.setSession).toHaveBeenCalledWith('access', 'refresh');
            expect(mockResponse.redirect).toHaveBeenCalledWith(303, 'http://localhost:4200/home');
        });

        it('should handle invalid tokens', async () => {
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;

            await controller.authCallback(undefined, undefined, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith('Invalid token');
        });
    });

/*
    describe('signInWithSpotifyOAuth', () => {
        it('should redirect to Spotify OAuth URL', async () => {
            const mockResponse = {
                redirect: jest.fn(),
            } as unknown as Response;
    
            // Mock the signinWithOAuth method
            const mockSigninWithOAuth = jest
                .spyOn(supabaseService, 'signinWithOAuth')
                .mockResolvedValue('https://spotify.oauth.url');
    
            await controller.signInWithSpotifyOAuth(mockResponse);
    
            // Verify that signinWithOAuth was called with the correct provider
            expect(mockSigninWithOAuth).toHaveBeenCalledWith({ provider: 'spotify' });
    
            // Verify that the response redirected correctly
            expect(mockResponse.redirect).toHaveBeenCalledWith(303, 'https://spotify.oauth.url');
        });
    });
*/
    describe('signIn', () => {
        it('should sign in a user', async () => {
            const authDto = { email: 'test@example.com', password: 'password' };
            const mockResult = { user: { id: 'user1' }, session: { token: 'token' } };

            (authService.signIn as jest.Mock).mockResolvedValue(mockResult);

            const result = await controller.signIn(authDto);

            expect(authService.signIn).toHaveBeenCalledWith(authDto);
            expect(result).toEqual(mockResult);
        });
    });

    describe('signUp', () => {
        it('should sign up a new user', async () => {
            const signUpData = { email: 'new@example.com', password: 'password', metadata: { name: 'New User' } };
            const mockResult = { user: { id: 'newUser' }, session: { token: 'newToken' } };

            (authService.signUp as jest.Mock).mockResolvedValue(mockResult);

            const result = await controller.signUp(signUpData);

            expect(authService.signUp).toHaveBeenCalledWith(signUpData.email, signUpData.password, signUpData.metadata);
            expect(result).toEqual(mockResult);
        });
    });

    describe('signOut', () => {
        it('should sign out a user', async () => {
            const tokens = { accessToken: 'access', refreshToken: 'refresh' };
            const mockResult = { message: 'Signed out successfully' };

            (authService.signOut as jest.Mock).mockResolvedValue(mockResult);

            const result = await controller.signOut(tokens);

            expect(authService.signOut).toHaveBeenCalledWith(tokens.accessToken, tokens.refreshToken);
            expect(result).toEqual(mockResult);
        });
    });

    describe('getCurrentUser', () => {
        it('should get the current user', async () => {
            const tokens = { accessToken: 'access', refreshToken: 'refresh' };
            const mockUser = { id: 'user1', email: 'user@example.com' };

            (authService.getCurrentUser as jest.Mock).mockResolvedValue({ user: mockUser });

            const result = await controller.getCurrentUser(tokens);

            expect(authService.getCurrentUser).toHaveBeenCalledWith(tokens.accessToken, tokens.refreshToken);
            expect(result).toEqual({ user: mockUser });
        });
    });

    describe('getProvider', () => {
        it('should get the provider for a user', async () => {
            const tokens = { accessToken: 'access', refreshToken: 'refresh' };
            const mockResult = { provider: 'spotify', message: 'Provider retrieved' };

            (authService.getProvider as jest.Mock).mockResolvedValue(mockResult);

            const result = await controller.getProvider(tokens);

            expect(authService.getProvider).toHaveBeenCalledWith(tokens.accessToken, tokens.refreshToken);
            expect(result).toEqual(mockResult);
        });
    });
});