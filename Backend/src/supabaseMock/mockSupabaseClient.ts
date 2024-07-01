// mockSupabaseClient.ts

export interface MockSupabaseClient {
    // Define mock methods here based on your usage
    auth: () => {
        // Mocked auth method
        signIn: (options: any) => Promise<any>;
        // More methods as needed
    };
    // Other methods if used
}

export const createClient = (supabaseUrl: string, supabaseAnonKey: string): MockSupabaseClient => {
    return {
        auth: () => ({
            signIn: async (options: any) => {
                // Mocked signIn method logic
                return { user: { id: 1, email: 'test@example.com' }, session: { accessToken: 'mockedAccessToken' } };
            },
            // More mocked methods as needed
        }),
        // Other mocked client methods if used
    };
};
