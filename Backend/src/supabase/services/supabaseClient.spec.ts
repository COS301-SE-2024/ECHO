import { createSupabaseClient } from './supabaseClient';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(),
}));

describe('createSupabaseClient', () => {
    const supabaseUrl = 'https://example.supabase.co';
    const supabaseAnonKey = 'anon-key';

    beforeEach(() => {
        process.env.SUPABASE_URL = supabaseUrl;
        process.env.SUPABASE_ANON_KEY = supabaseAnonKey;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if SUPABASE_URL is not defined', () => {
        delete process.env.SUPABASE_URL;
        expect(() => createSupabaseClient()).toThrow('Supabase URL and anon key are required.');
    });

    it('should throw an error if SUPABASE_ANON_KEY is not defined', () => {
        delete process.env.SUPABASE_ANON_KEY;
        expect(() => createSupabaseClient()).toThrow('Supabase URL and anon key are required.');
    });

    it('should call createClient with the correct parameters', () => {
        createSupabaseClient();
        expect(createClient).toHaveBeenCalledWith(supabaseUrl, supabaseAnonKey);
    });

    it('should return the client created by createClient', () => {
        const mockClient = {};
        (createClient as jest.Mock).mockReturnValue(mockClient);
        const client = createSupabaseClient();
        expect(client).toBe(mockClient);
    });
});
