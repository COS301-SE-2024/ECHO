import { Injectable } from "@nestjs/common";
import { supabase } from "../lib/supabaseClient";
import { encryptionKey } from "../config";
import { AuthService } from "../services/auth.service";
import * as crypto from "crypto";

@Injectable()
export class SupabaseService {
    private encryptionKey: Buffer;

    constructor() {
        this.encryptionKey = Buffer.from(encryptionKey, "base64");
    }

    async signInWithSpotifyOAuth() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "spotify",
            options: {
                redirectTo: "http://localhost:4200/auth/callback"
            }
        });
        if (error) {
            throw new Error(error.message);
        }
        console.log(this.encryptionKey.length);
        return data.url;
    }

    async exchangeCodeForSession(code: string) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            throw new Error(error.message);
        }
    }


    async handleSpotifyTokens(accessToken: string, refreshToken: string, providerToken: string, providerRefreshToken: string) {
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

    async insertTokens(userId: string, providerToken: string, providerRefreshToken: string): Promise<void> {
        const encryptedProviderToken = providerToken;
        const encryptedProviderRefreshToken = providerRefreshToken;

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

    encryptToken(token: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-cbc", this.encryptionKey, iv);
        let encrypted = cipher.update(token, "utf8", "base64");
        encrypted += cipher.final("base64");
        return `${iv.toString("base64")}:${encrypted}`;
    }

    decryptToken(encryptedToken: string): string {
        const [iv, encrypted] = encryptedToken.split(":");
        const decipher = crypto.createDecipheriv("aes-256-cbc", this.encryptionKey, Buffer.from(iv, "base64"));
        let decrypted = decipher.update(encrypted, "base64", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }

    async retrieveTokens(userId: string) {
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
