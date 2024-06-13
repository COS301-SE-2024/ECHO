import { config } from 'dotenv';

config();

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
export const encryptionKey = process.env.SECRET_ENCRYPTION_KEY;