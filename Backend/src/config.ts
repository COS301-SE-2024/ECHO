import { config } from 'dotenv';
import * as process from "process";

config();

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
export const encryptionKey = process.env.SECRET_ENCRYPTION_KEY;

export const accessKey = process.env.ACCESS_KEY;