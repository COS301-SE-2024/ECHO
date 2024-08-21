import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { SupabaseService } from '../../supabase/services/supabase.service';
import { createSupabaseClient } from '../../supabase/services/supabaseClient';
import { Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import exp from 'constants';
import { ExternalExceptionFilterContext } from '@nestjs/core/exceptions/external-exception-filter-context';

jest.mock('../../supabase/services/supabaseClient');

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;
    let supabaseService: SupabaseService;
    let mockSupabaseClient: any;
    let mockResponse: Partial<Response>;
    let consoleErrorSpy: jest.SpyInstance;

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
            signinWithOAuth: jest.fn(),
        };

        mockSupabaseClient = {
            auth: {
                setSession: jest.fn(),
                getUser: jest.fn(),
            },
        };

        (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient);

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

        mockResponse = {
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore(); // Restore the original console.error after each test
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

        it('should recieve an error', async () => {
            const tokens = {
                accessToken: '',
                refreshToken: '',
                providerToken: '',
                providerRefreshToken: '',
            };

            const result = await controller.receiveTokens(tokens);

            expect(result).toEqual({ status: 'error', error: "Invalid tokens" });
            expect(supabaseService.handleSpotifyTokens).not.toHaveBeenCalled();
        });
    });

    describe('receiveCode', () => {
        it('should process received code', async () => {
            const code = 'authcode';

            const result = await controller.receiveCode({ code });

            expect(result).toEqual({ message: "Code received and processed" });
            expect(supabaseService.exchangeCodeForSession).toHaveBeenCalledWith(code);
        });

        it('should return an error object', async () => {
            const code = null;

            const result = await controller.receiveCode({ code });

            expect(result).toEqual({status: 'error', error: "No code provided"});
            expect(supabaseService.exchangeCodeForSession).not.toHaveBeenCalled();
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

        it('should return an error when an acess token is not included', async () => {
            const result = await controller.getProviderTokens({
                accessToken: null,
                refreshToken: 'refresh',
            });

            expect(result).toEqual({ status: 'error', error: 'No access token or refresh token found in request.' });
        });

        it('should throw a user error when one is returned by supabase.auth.getUser', async () =>{
            const mockUserResponse = {
                data: null,
                error: 'mockError'
            };

            mockSupabaseClient.auth.setSession.mockResolvedValue(undefined);
            mockSupabaseClient.auth.getUser.mockResolvedValue(mockUserResponse);

            const result = await controller.getProviderTokens({
                    accessToken: "access-token",
                    refreshToken: 'refresh-token',
                });

            expect(result).toEqual({ status: 'error', message: 'Failed to retrieve provider tokens' });
            expect(mockSupabaseClient.auth.setSession).toHaveBeenCalledWith('access-token', 'refresh-token');
            expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith('access-token');
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

        it('should print an error into the console and return an error 500', async () => {
            const mockError = new Error('Session Error');
            (authService.setSession as jest.Mock).mockRejectedValue(mockError);

            await controller.authCallback('validAccessToken', 'validRefreshToken', mockResponse as Response);

            expect(authService.setSession).toHaveBeenCalledWith('validAccessToken', 'validRefreshToken');
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith('Internal Server Error');
            expect(console.error).toHaveBeenCalledWith('Error setting session:', mockError);

        });
    });



    
    describe('signInWithSpotifyOAuth', () => {
        it('should redirect to Spotify OAuth URL', async () => {
            const mockUrl = 'http://oauth-url.com';
            (supabaseService.signinWithOAuth as jest.Mock).mockResolvedValue(mockUrl);
            const result = await controller.signInWithSpotifyOAuth({provider: 'spotify'});

            expect(supabaseService.signinWithOAuth).toHaveBeenCalledWith('spotify');
            expect(result).toEqual({url: mockUrl});
        });

        it('should return an error if no provider is provided', async () => {
            const result = await controller.signInWithSpotifyOAuth({provider: null});

            expect(result).toEqual({ status: 'error', error: 'No provider specified' });
            expect(supabaseService.signinWithOAuth).not.toHaveBeenCalled();
        });

        it('should throw an HttpException if an error occurs during OAuth sign-in', async () => {
            const mockError = new Error('OAuth sign-in failed');
            (supabaseService.signinWithOAuth as jest.Mock).mockRejectedValue(mockError);
        
            await expect(controller.signInWithSpotifyOAuth({ provider: 'spotify' })).rejects.toThrow(
              new HttpException(mockError.message, HttpStatus.BAD_REQUEST)
            );
        
            expect(supabaseService.signinWithOAuth).toHaveBeenCalledWith('spotify');
        });
    });

    describe('signIn', () => {
        it('should sign in a user', async () => {
            const authDto = { email: 'test@example.com', password: 'password' };
            const mockResult = { user: { id: 'user1' }, session: { token: 'token' } };

            (authService.signIn as jest.Mock).mockResolvedValue(mockResult);

            const result = await controller.signIn(authDto);

            expect(authService.signIn).toHaveBeenCalledWith(authDto);
            expect(result).toEqual(mockResult);
        });

        it('should return an error object', async () => {
            const authDto = { email: '', password: 'password' };
            
            const result = await controller.signIn(authDto);

            expect(result).toEqual({ error: "Invalid email or password" });
            expect(authService.signIn).not.toHaveBeenCalled();
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

        it('should return an error if email or password is missing', async () => {
            const result = await controller.signUp({ email: '', password: '', metadata: {} });
      
            expect(result).toEqual({
              status: 'error',
              error: 'Invalid email or password',
            });
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

        it('should return an error if accessToken or refreshToken is missing', async () => {
            const result = await controller.signOut({ accessToken: '', refreshToken: '' });
      
            expect(result).toEqual({
              status: 'error',
              error: 'No access token or refresh token found in sign-out request.',
            });
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

        it('should return error object', async () => {
            const tokens = { accessToken: '', refreshToken: '' };

            const result = await controller.getCurrentUser(tokens);
            expect(result).toEqual({ status: 'error', error: "No access token or refresh token provided when attempting to retrieve current user." });
            expect(authService.getCurrentUser).not.toHaveBeenCalled();
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

        it('should return an error if accessToken or refreshToken is missing', async () => {
            const result = await controller.getProvider({ accessToken: '', refreshToken: '' });
      
            expect(result).toEqual({ 
                provider: "none", 
                message: "No access token or refresh token found in request." 
            });
        });
    });
});