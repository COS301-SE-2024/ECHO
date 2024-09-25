import { SupabaseService } from './supabase.service';
import { createSupabaseClient } from './supabaseClient';
import * as crypto from 'crypto';

jest.mock('./supabaseClient', () => ({
  createSupabaseClient: jest.fn(),
}));

jest.mock("../../config", () => ({
    encryptionKey: "dGVzdGVuY3J5cHRpb25rZXk=", // Example base64-encoded string
  }));

jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from('randombytes', 'utf-8')),
  createCipheriv: jest.fn(() => ({
    update: jest.fn().mockReturnValue('encrypted_part'),
    final: jest.fn().mockReturnValue('encrypted_final'),
  })),
  createDecipheriv: jest.fn(() => ({
    update: jest.fn().mockReturnValue('decrypted_part'),
    final: jest.fn().mockReturnValue('decrypted_final'),
  })),
}));

describe('SupabaseService', () => {
  let service: SupabaseService;
  let supabaseMock: any;

  beforeEach(() => {
    service = new SupabaseService();
    supabaseMock = {
      auth: {
        signInWithOAuth: jest.fn(),
        exchangeCodeForSession: jest.fn(),
        setSession: jest.fn(),
        getUser: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      upsert: jest.fn(),
      select: jest.fn(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };
    (createSupabaseClient as jest.Mock).mockReturnValue(supabaseMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signinWithOAuth', () => {
    it('should sign in with OAuth using the given provider', async () => {
      supabaseMock.auth.signInWithOAuth.mockResolvedValue({ data: { url: 'http://test-url' }, error: null });
      const url = await service.signinWithOAuth('spotify');
      expect(supabaseMock.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'spotify',
        options: {
          redirectTo: 'http://localhost:4200/auth/callback',
          scopes: expect.any(String),
        },
      });
      expect(url).toBe('http://test-url');
    });

    it('should throw an error if signInWithOAuth fails', async () => {
      supabaseMock.auth.signInWithOAuth.mockResolvedValue({ data: null, error: { message: 'OAuth error' } });
      await expect(service.signinWithOAuth('spotify')).rejects.toThrow('OAuth error');
    });
  });

  describe('exchangeCodeForSession', () => {
    it('should exchange the code for a session', async () => {
      supabaseMock.auth.exchangeCodeForSession.mockResolvedValue({ error: null });
      await expect(service.exchangeCodeForSession('test_code')).resolves.not.toThrow();
      expect(supabaseMock.auth.exchangeCodeForSession).toHaveBeenCalledWith('test_code');
    });

    it('should throw an error if exchangeCodeForSession fails', async () => {
      supabaseMock.auth.exchangeCodeForSession.mockResolvedValue({ error: { message: 'Session error' } });
      await expect(service.exchangeCodeForSession('test_code')).rejects.toThrow('Session error');
    });
  });

  describe('handleSpotifyTokens', () => {
    it('should handle tokens and insert them into user_tokens table', async () => {
      supabaseMock.auth.setSession.mockResolvedValue({ error: null });
      supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user_id' } }, error: null });
      const insertTokensSpy = jest.spyOn(service, 'insertTokens').mockResolvedValue();

      await service.handleSpotifyTokens('access', 'refresh', 'providerToken', 'providerRefreshToken');

      expect(supabaseMock.auth.setSession).toHaveBeenCalledWith({
        access_token: 'access',
        refresh_token: 'refresh',
      });
      expect(insertTokensSpy).toHaveBeenCalledWith('user_id', expect.any(String), expect.any(String));
    });

    it('should return error message if tokens are missing', async () => {
      const response = await service.handleSpotifyTokens('', '', '', '');
      expect(response).toEqual({
        message: 'Error occurred during OAuth Sign In while processing tokens - please try again.',
      });
    });
  });

  describe('insertTokens', () => {
    it('should upsert tokens into user_tokens table', async () => {
      supabaseMock.upsert.mockResolvedValue({ data: 'inserted_data', error: null });
      await service.insertTokens('user_id', 'encrypted_provider_token', 'encrypted_provider_refresh_token');
      expect(supabaseMock.upsert).toHaveBeenCalledWith(
        [
          {
            user_id: 'user_id',
            encrypted_provider_token: 'encrypted_provider_token',
            encrypted_provider_refresh_token: 'encrypted_provider_refresh_token',
          },
        ],
        { onConflict: 'user_id' },
      );
    });

    it('should throw an error if upsert fails', async () => {
      supabaseMock.upsert.mockResolvedValue({ data: null, error: { message: 'Insert error' } });
      await expect(
        service.insertTokens('user_id', 'encrypted_provider_token', 'encrypted_provider_refresh_token'),
      ).rejects.toThrow('Failed to update or insert tokens');
    });
  });

  describe('encryptToken', () => {
    it('should encrypt a token', () => {
      const encrypted = service.encryptToken('test_token');
      expect(crypto.createCipheriv).toHaveBeenCalled();
      expect(encrypted).toContain(':');
    });
  });

  describe('decryptToken', () => {
    it('should decrypt an encrypted token', () => {
      const decrypted = service.decryptToken('iv:encrypted');
      expect(crypto.createDecipheriv).toHaveBeenCalled();
      expect(decrypted).toBe('decrypted_partdecrypted_final');
    });
  });

  describe('retrieveTokens', () => {
    it('should retrieve and decrypt tokens from user_tokens table', async () => {
      supabaseMock.single.mockResolvedValue({
        data: { encrypted_provider_token: 'encrypted', encrypted_provider_refresh_token: 'encrypted' },
        error: null,
      });
      const tokens = await service.retrieveTokens('user_id');
      expect(supabaseMock.select).toHaveBeenCalledWith('encrypted_provider_token, encrypted_provider_refresh_token');
      expect(tokens).toEqual({ providerToken: 'decrypted_partdecrypted_final', providerRefreshToken: 'decrypted_partdecrypted_final' });
    });

    it('should throw an error if retrieval fails', async () => {
      supabaseMock.single.mockResolvedValue({ data: null, error: { message: 'Retrieval error' } });
      await expect(service.retrieveTokens('user_id')).rejects.toThrow('Failed to retrieve tokens');
    });
  });
});
