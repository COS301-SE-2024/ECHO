import { createClient } from '@supabase/supabase-js';

// Function to create a new Supabase client (for each request, ensuring no session overlap)
export const createSupabaseClient = (): any => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and anon key are required.');
    }

    return createClient(supabaseUrl, supabaseAnonKey);
};