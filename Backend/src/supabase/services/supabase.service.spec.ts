import { SupabaseService } from './supabase.service';
import { createSupabaseClient } from './supabaseClient';
import * as crypto from 'crypto';

jest.mock('./supabaseClient', () => ({
    createSupabaseClient: jest.fn(),
}));

describe('SupabaseService', () => {
    let supabaseService: SupabaseService;

    beforeEach(() => {
        process.env.SECRET_ENCRYPTION_KEY = Buffer.from('test-key').toString('base64');
        supabaseService = new SupabaseService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signInWithSpotifyOAuth', () => {
        it('should call supabase.auth.signInWithOAuth and return the URL', async () => {
            const mockSupabase = {
                auth: {
                    signInWithOAuth: jest.fn().mockResolvedValue({ data: { url: 'http://localhost' }, error: null }),
                },
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            const result = await supabaseService.signInWithSpotifyOAuth();
            expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
                provider: 'spotify',
                options: {
                    redirectTo: 'http://localhost:4200/auth/callback',
                    scopes: 'streaming user-read-email user-read-private user-read-recently-played user-read-playback-state user-modify-playback-state user-library-read',
                },
            });
            expect(result).toBe('http://localhost');
        });

        it('should throw an error if signInWithOAuth fails', async () => {
            const mockSupabase = {
                auth: {
                    signInWithOAuth: jest.fn().mockResolvedValue({ data: null, error: { message: 'OAuth error' } }),
                },
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            await expect(supabaseService.signInWithSpotifyOAuth()).rejects.toThrow('OAuth error');
        });
    });

    describe('exchangeCodeForSession', () => {
        it('should call supabase.auth.exchangeCodeForSession and handle success', async () => {
            const mockSupabase = {
                auth: {
                    exchangeCodeForSession: jest.fn().mockResolvedValue({ error: null }),
                },
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            await supabaseService.exchangeCodeForSession('test-code');
            expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('test-code');
        });

        it('should throw an error if exchangeCodeForSession fails', async () => {
            const mockSupabase = {
                auth: {
                    exchangeCodeForSession: jest.fn().mockResolvedValue({ error: { message: 'Session error' } }),
                },
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            await expect(supabaseService.exchangeCodeForSession('test-code')).rejects.toThrow('Session error');
        });
    });

    describe('handleSpotifyTokens', () => {
        it('should set session and insert tokens on success', async () => {
            const mockSupabase = {
                auth: {
                    setSession: jest.fn().mockResolvedValue({ error: null }),
                    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
                },
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            const insertTokensSpy = jest.spyOn(supabaseService, 'insertTokens').mockResolvedValue();

            await supabaseService.handleSpotifyTokens('access', 'refresh', 'provider', 'providerRefresh');
            expect(mockSupabase.auth.setSession).toHaveBeenCalledWith({ access_token: 'access', refresh_token: 'refresh' });
            expect(insertTokensSpy).toHaveBeenCalledWith('test-user', expect.any(String), expect.any(String));
        });

        it('should log error if setSession fails', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const mockSupabase = {
                auth: {
                    setSession: jest.fn().mockResolvedValue({ error: 'Session error' }),
                },
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            await supabaseService.handleSpotifyTokens('access', 'refresh', 'provider', 'providerRefresh');
            expect(consoleSpy).toHaveBeenCalledWith('Error setting session:', 'Session error');
        });

        it('should log error if getUser fails', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const mockSupabase = {
                auth: {
                    setSession: jest.fn().mockResolvedValue({ error: null }),
                    getUser: jest.fn().mockResolvedValue({ data: null, error: 'User error' }),
                },
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            await supabaseService.handleSpotifyTokens('access', 'refresh', 'provider', 'providerRefresh');
            expect(consoleSpy).toHaveBeenCalledWith('Error retrieving user:', 'User error');
        });
    });

    describe('insertTokens', () => {
        it('should insert tokens into the database', async () => {
            const mockSupabase = {
                from: jest.fn().mockReturnThis(),
                upsert: jest.fn().mockResolvedValue({ data: {}, error: null }),
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            await supabaseService.insertTokens('test-user', 'encryptedToken', 'encryptedRefreshToken');
            expect(mockSupabase.from).toHaveBeenCalledWith('user_tokens');
            expect(mockSupabase.upsert).toHaveBeenCalledWith([
                {
                    user_id: 'test-user',
                    encrypted_provider_token: 'encryptedToken',
                    encrypted_provider_refresh_token: 'encryptedRefreshToken',
                },
            ], {
                onConflict: 'user_id',
            });
        });

        it('should throw an error if upsert fails', async () => {
            const mockSupabase = {
                from: jest.fn().mockReturnThis(),
                upsert: jest.fn().mockResolvedValue({ data: null, error: 'Insert error' }),
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            await expect(supabaseService.insertTokens('test-user', 'encryptedToken', 'encryptedRefreshToken')).rejects.toThrow('Failed to update or insert tokens');
        });
    });

    describe('encryptToken', () => {
        it('should encrypt a token', () => {
            const token = 'test-token';
            const encryptedToken = supabaseService.encryptToken(token);

            expect(encryptedToken).toContain(':'); // Check if the result contains the IV and encrypted token parts
        });
    });

    describe('decryptToken', () => {
        it('should decrypt a token', () => {
            const token = 'test-token';
            const encryptedToken = supabaseService.encryptToken(token);
            const decryptedToken = supabaseService.decryptToken(encryptedToken);

            expect(decryptedToken).toBe(token);
        });
    });

    describe('retrieveTokens', () => {
        it('should retrieve and decrypt tokens from the database', async () => {
            const mockSupabase = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: { encrypted_provider_token: 'encryptedToken', encrypted_provider_refresh_token: 'encryptedRefreshToken' }, error: null }),
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            const decryptTokenSpy = jest.spyOn(supabaseService, 'decryptToken').mockReturnValueOnce('providerToken').mockReturnValueOnce('providerRefreshToken');

            const tokens = await supabaseService.retrieveTokens('test-user');
            expect(tokens).toEqual({ providerToken: 'providerToken', providerRefreshToken: 'providerRefreshToken' });
            expect(decryptTokenSpy).toHaveBeenCalledWith('encryptedToken');
            expect(decryptTokenSpy).toHaveBeenCalledWith('encryptedRefreshToken');
        });

        it('should throw an error if retrieval fails', async () => {
            const mockSupabase = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: null, error: 'Retrieve error' }),
            };
            (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

            await expect(supabaseService.retrieveTokens('test-user')).rejects.toThrow('Failed to retrieve tokens');
        });
    });
});
