import { Injectable } from "@nestjs/common";
import { createSupabaseClient } from "./supabaseClient";
import { encryptionKey } from "../../config";
import { AuthService } from "../../auth/services/auth.service";
import * as crypto from "crypto";

@Injectable()
export class SupabaseService {
    private encryptionKey: Buffer;

    constructor() {
        this.encryptionKey = Buffer.from(encryptionKey, "base64");
    }

    // This method is used to sign in with Spotify OAuth.
    async signInWithSpotifyOAuth() {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "spotify",
            options: {
                redirectTo: "http://localhost:4200/auth/callback",
                scopes: "streaming user-read-email user-read-private user-read-recently-played user-read-playback-state user-modify-playback-state user-library-read"
            }
        });
        if (error) {
            throw new Error(error.message);
        }
        return data.url;
    }

    // This method is used to exchange the code (returned by a provider) for a session (from Supabase).
    async exchangeCodeForSession(code: string) {
        const supabase = createSupabaseClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            throw new Error(error.message);
        }
    }

    // This method is used to handle tokens from Spotify and store them in the Supabase user_tokens table.
    async handleSpotifyTokens(accessToken: string, refreshToken: string, providerToken: string, providerRefreshToken: string) {
        const supabase = createSupabaseClient();
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (error) {
            console.error("Error setting session:", error);
            return;
        }

        const { data, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error("Error retrieving user:", userError);
            return;
        }

        if (data.user) {
            const userId: string = data.user.id;
            await this.insertTokens(userId, this.encryptToken(providerToken), this.encryptToken(providerRefreshToken));
        } else {
            console.log("No user data available.");
        }
    }

    // This method is used to insert tokens into the user_tokens table.
    async insertTokens(userId: string, providerToken: string, providerRefreshToken: string): Promise<void> {
        const encryptedProviderToken = providerToken;
        const encryptedProviderRefreshToken = providerRefreshToken;
        const supabase = createSupabaseClient();

        const { data, error } = await supabase
            .from("user_tokens")
            .upsert([
                {
                    user_id: userId,
                    encrypted_provider_token: encryptedProviderToken,
                    encrypted_provider_refresh_token: encryptedProviderRefreshToken
                }
            ], {
                onConflict: "user_id"
            });

        if (error) {
            console.error("Error updating or inserting token data:", error);
            throw new Error("Failed to update or insert tokens");
        }
        return data;
    }

    // This method is used to encrypt a token.
    encryptToken(token: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-cbc", this.encryptionKey, iv);
        let encrypted = cipher.update(token, "utf8", "base64");
        encrypted += cipher.final("base64");
        return `${iv.toString("base64")}:${encrypted}`;
    }

    // This method is used to decrypt a token.
    decryptToken(encryptedToken: string): string {
        const [iv, encrypted] = encryptedToken.split(":");
        const decipher = crypto.createDecipheriv("aes-256-cbc", this.encryptionKey, Buffer.from(iv, "base64"));
        let decrypted = decipher.update(encrypted, "base64", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }

    // This method is used to retrieve tokens from the user_tokens table.
    async retrieveTokens(userId: string) {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
            .from("user_tokens")
            .select("encrypted_provider_token, encrypted_provider_refresh_token")
            .eq("user_id", userId)
            .single();

        if (error) {
            console.error("Error retrieving tokens:", error);
            throw new Error("Failed to retrieve tokens");
        }

        if (data) {
            const providerToken = this.decryptToken(data.encrypted_provider_token);
            const providerRefreshToken = this.decryptToken(data.encrypted_provider_refresh_token);
            return { providerToken, providerRefreshToken };
        }

        return null;
    }
}
