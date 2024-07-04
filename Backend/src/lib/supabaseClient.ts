import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from '../config';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anon key are required.');
}

// Function to create a new Supabase client
export const createSupabaseClient = (): any => { // Replace 'any' with the actual type of the client
    return createClient(supabaseUrl, supabaseAnonKey);
};