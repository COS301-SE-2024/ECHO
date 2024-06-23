// supabaseMock.js

export const createClient = jest.fn(() => ({
    // Mocked client methods
    from: () => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        // Add other methods as needed for your tests
    }),
    auth: {
        // Mocked auth methods
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        // Add other auth methods as needed for your tests
    },
    // Add other client properties or methods as needed for your tests
}));

export const supabaseUrl = 'http://example.com'; // Replace with your actual Supabase URL
export const supabaseAnonKey = 'mocked-anon-key'; // Replace with your actual Supabase anon key
