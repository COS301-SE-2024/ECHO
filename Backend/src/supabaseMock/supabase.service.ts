import { createClient } from "./supabaseClient";

export const supabaseUrl = 'mocked-url';
export const supabaseAnonKey = 'mocked-anon-key';

export const supabaseServiceMock = {
    signInWithSpotifyOAuth: jest.fn().mockResolvedValue("http://mock-url"),
    exchangeCodeForSession: jest.fn().mockResolvedValue({}),
    handleSpotifyTokens: jest.fn().mockResolvedValue(undefined),
    insertTokens: jest.fn().mockResolvedValue({}),
    retrieveTokens: jest.fn().mockResolvedValue({}),
    encryptToken: jest.fn((token) => `encrypted:${token}`),
    decryptToken: jest.fn((encryptedToken) => encryptedToken.replace('encrypted:', '')),
};
