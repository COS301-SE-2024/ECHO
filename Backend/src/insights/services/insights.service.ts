import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import axios from "axios";
import { createSupabaseClient } from "../../supabase/services/supabaseClient";
import { SupabaseService } from "../../supabase/services/supabase.service";

@Injectable()
export class InsightsService
{
    constructor(private supabaseService: SupabaseService)
    {
    }

    // Helper to get user details from Supabase
    private async getUserFromSupabase(accessToken: string): Promise<any>
    {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase.auth.getUser(accessToken);

        if (error)
        {
            throw new HttpException("Invalid access token", HttpStatus.UNAUTHORIZED);
        }

        return data.user;
    }

    // Get top mood based on user's listening history
    async getTopMood(
        accessToken: string,
        refreshToken: string,
        providerName: string
    ): Promise<any>
    {
        await this.setSupabaseSession(accessToken, refreshToken);
        const userId = await this.getUserIdFromAccessToken(accessToken);
        const { providerToken } = await this.supabaseService.retrieveTokens(userId);

        if (providerName === "spotify")
        {
            return this.getTopMoodFromSpotify(providerToken);
        }
        else if (providerName === "youtube")
        {
            return this.getTopMoodFromYouTube(providerToken);
        }

        throw new HttpException("Invalid provider", HttpStatus.BAD_REQUEST);
    }

    private async fetchSpotifyArtistsVsTracks(providerToken: string)
    {
        try
        {
            const artistResponse = await axios.get("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
                headers: { Authorization: `Bearer ${providerToken}` }
            });
            const trackResponse = await axios.get("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
                headers: { Authorization: `Bearer ${providerToken}` }
            });

            const artistsData = artistResponse.data.items.map((item: any) => item.track.artists).flat();
            const tracksData = trackResponse.data.items.map((item: any) => item.track);

            return this.parseArtistsVsTracks(artistsData, tracksData);
        }
        catch (error)
        {
            if (error.response && error.response.status === 401)
            {
                throw new HttpException("Unauthorized access to Spotify API", HttpStatus.UNAUTHORIZED);
            }
            throw new HttpException("Spotify API error with tracks vs artists", HttpStatus.BAD_REQUEST);
        }
    }

    private async fetchSpotifyListeningOverTime(providerToken: string)
    {
        const url = "https://api.spotify.com/v1/me/player/recently-played";
        try
        {
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${providerToken}` }
            });

            if (!response.data || !response.data.items || response.data.items.length === 0)
            {
                return {}; // Return an empty object if data is empty
            }

            return this.parseListeningOverTime(response.data.items);
        }
        catch (error)
        {
            throw new HttpException("Spotify API error listening over time", HttpStatus.BAD_REQUEST);
        }
    }

    async getTopMoodFromSpotify(providerToken: string): Promise<any>
    {
        const url = "https://api.spotify.com/v1/me/top/tracks?limit=10";

        try
        {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${providerToken}`
                }
            });
            const topTracks = response.data.items;

            if (!topTracks || topTracks.length === 0)
            {
                return { mood: "Happy" }; // Default mood if no tracks are found
            }

            const genreCounts: { [key: string]: number } = {};

            // Count occurrences of each genre
            topTracks.forEach((track) =>
            {
                track.artists.forEach((artist) =>
                {
                    if (artist.genres)
                    {
                        artist.genres.forEach((genre) =>
                        {
                            if (genreCounts[genre])
                            {
                                genreCounts[genre]++;
                            }
                            else
                            {
                                genreCounts[genre] = 1;
                            }
                        });
                    }
                });
            });

            // Determine the top genre
            const topGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b, "");

            // Map genre to mood
            const genreToMoodMap: { [key: string]: string } = {
                "pop": "Energetic",
                "classical": "Relaxed",
                "rock": "Energetic",
                "jazz": "Calm",
                "blues": "Melancholic",
                "hip hop": "Energetic",
                "electronic": "Upbeat"
            };

            const mood = genreToMoodMap[topGenre] || "Happy";

            return { mood };
        }
        catch (error)
        {
            throw new HttpException("Spotify API error top mood", HttpStatus.BAD_REQUEST);
        }
    }

    async getTopMoodFromYouTube(providerToken: string): Promise<any>
    {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&access_token=${providerToken}`;

        try
        {
            const response = await axios.get(url);
            const likedVideos = response.data.items;

            let mood = "Energetic";

            if (likedVideos.some((video) => video.snippet.categoryId === "Music"))
            {
                mood = "Energetic";
            }
            else if (likedVideos.some((video) => video.snippet.categoryId === "Education"))
            {
                mood = "Focused";
            }

            return { mood };
        }
        catch (error)
        {
            throw new HttpException("YouTube API error", HttpStatus.BAD_REQUEST);
        }
    }

    // Get total listening time from Spotify or YouTube
    async getTotalListeningTime(
        accessToken: string,
        refreshToken: string,
        providerName: string
    ): Promise<any>
    {
        await this.setSupabaseSession(accessToken, refreshToken);
        const userId = await this.getUserIdFromAccessToken(accessToken);
        const { providerToken } = await this.supabaseService.retrieveTokens(userId);

        if (providerName === "spotify")
        {
            return this.getTotalListeningTimeFromSpotify(providerToken);
        }
        else if (providerName === "youtube")
        {
            return this.getTotalListeningTimeFromYouTube(providerToken);
        }

        throw new HttpException("Invalid provider", HttpStatus.BAD_REQUEST);
    }

    async getTotalListeningTimeFromSpotify(providerToken: string): Promise<any>
    {
        const url = "https://api.spotify.com/v1/me/player/recently-played";
        try
        {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${providerToken}`
                }
            });
            const tracks = response.data.items;
            let totalListeningTime = 0;

            tracks.forEach((track) =>
            {
                totalListeningTime += track.track.duration_ms;
            });

            const hours = totalListeningTime / (1000 * 60 * 60);
            return { totalListeningTime: `${hours.toFixed(2)} hours` };
        }
        catch (error)
        {
            throw new HttpException("Spotify API error total listening time", HttpStatus.BAD_REQUEST);
        }
    }

    async getTotalListeningTimeFromYouTube(providerToken: string): Promise<any>
    {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&myRating=like&access_token=${providerToken}`;
        try
        {
            const response = await axios.get(url);
            const likedVideos = response.data.items;
            let totalListeningTime = 0;

            likedVideos.forEach((video) =>
            {
                const duration = video.contentDetails.duration;
                const time = this.parseYouTubeDuration(duration);
                totalListeningTime += time;
            });

            const hours = totalListeningTime / (60 * 60);
            return { totalListeningTime: `${hours.toFixed(2)} hours` };
        }
        catch (error)
        {
            throw new HttpException("YouTube API error", HttpStatus.BAD_REQUEST);
        }
    }

    // Get most played track for a user
    async getMostPlayedTrack(
        accessToken: string,
        refreshToken: string,
        providerName: string
    ): Promise<any>
    {
        await this.setSupabaseSession(accessToken, refreshToken);
        const userId = await this.getUserIdFromAccessToken(accessToken);
        const { providerToken } = await this.supabaseService.retrieveTokens(userId);

        if (providerName === "spotify")
        {
            return this.getMostPlayedTrackFromSpotify(providerToken);
        }
        else if (providerName === "youtube")
        {
            return this.getMostPlayedTrackFromYouTube(providerToken);
        }

        throw new HttpException("Invalid provider", HttpStatus.BAD_REQUEST);
    }

    async getMostPlayedTrackFromSpotify(providerToken: string): Promise<any>
    {
        const url = "https://api.spotify.com/v1/me/top/tracks?limit=1";
        try
        {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${providerToken}`
                }
            });
            const track = response.data.items[0];
            return {
                name: track.name,
                artist: track.artists.map((artist) => artist.name).join(", ")
            };
        }
        catch (error)
        {
            throw new HttpException("Spotify API error most played track", HttpStatus.BAD_REQUEST);
        }
    }

    async getMostPlayedTrackFromYouTube(providerToken: string): Promise<any>
    {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&access_token=${providerToken}`;
        try
        {
            const response = await axios.get(url);
            const mostLikedVideo = response.data.items[0];
            return { name: mostLikedVideo.snippet.title };
        }
        catch (error)
        {
            throw new HttpException("YouTube API error", HttpStatus.BAD_REQUEST);
        }
    }

    // Get most listened artist for a user
    async getMostListenedArtist(
        accessToken: string,
        refreshToken: string,
        providerName: string
    ): Promise<any>
    {
        await this.setSupabaseSession(accessToken, refreshToken);
        const userId = await this.getUserIdFromAccessToken(accessToken);
        const { providerToken } = await this.supabaseService.retrieveTokens(userId);

        if (providerName === "spotify")
        {
            return this.getMostListenedArtistFromSpotify(providerToken);
        }
        else if (providerName === "youtube")
        {
            return this.getMostListenedArtistFromYouTube(providerToken);
        }

        throw new HttpException("Invalid provider", HttpStatus.BAD_REQUEST);
    }

    async getMostListenedArtistFromSpotify(providerToken: string): Promise<any>
    {
        const url = "https://api.spotify.com/v1/me/top/artists?limit=1";
        try
        {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${providerToken}`
                }
            });
            const artist = response.data.items[0];
            return { artist: artist.name };
        }
        catch (error)
        {
            throw new HttpException("Spotify API error listened artist", HttpStatus.BAD_REQUEST);
        }
    }

    async getMostListenedArtistFromYouTube(providerToken: string): Promise<any>
    {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${providerToken}`;
        try
        {
            const response = await axios.get(url);
            const channel = response.data.items[0];
            return { artist: channel.snippet.title };
        }
        catch (error)
        {
            throw new HttpException("YouTube API error", HttpStatus.BAD_REQUEST);
        }
    }

    // Helper to parse YouTube ISO 8601 duration
    parseYouTubeDuration(duration: string): number
    {
        const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
        const matches = regex.exec(duration);
        let totalSeconds = 0;

        if (matches[1]) totalSeconds += parseInt(matches[1].replace("H", "")) * 3600;
        if (matches[2]) totalSeconds += parseInt(matches[2].replace("M", "")) * 60;
        if (matches[3]) totalSeconds += parseInt(matches[3].replace("S", ""));

        return totalSeconds;
    }

    // Get top genre from Spotify or YouTube


    async getTopGenre(accessToken: string, refreshToken: string, providerName: string): Promise<any>
    {
        await this.setSupabaseSession(accessToken, refreshToken);
        const userId = await this.getUserIdFromAccessToken(accessToken);
        const { providerToken } = await this.supabaseService.retrieveTokens(userId);

        if (providerName === "spotify")
        {
            return this.getTopGenreFromSpotify(providerToken);
        }
        else if (providerName === "youtube")
        {
            return this.getTopGenreFromYouTube(providerToken);
        }

        throw new HttpException("Invalid provider", HttpStatus.BAD_REQUEST);
    }

    async getTopGenreFromSpotify(providerToken: string): Promise<any>
    {
        const url = "https://api.spotify.com/v1/me/top/tracks?limit=20";
        try
        {
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${providerToken}` }
            });

            if (!response.data || !response.data.items)
            {
                throw new HttpException("Invalid response from Spotify API", HttpStatus.BAD_REQUEST);
            }

            const topTracks = response.data.items;
            const genres = {};

            // Accumulate genres from artists
            topTracks.forEach((track) =>
            {
                track.artists.forEach((artist) =>
                {
                    if (artist.genres)
                    {
                        artist.genres.forEach((genre) =>
                        {
                            if (!genres[genre])
                            {
                                genres[genre] = 0;
                            }
                            genres[genre]++;
                        });
                    }
                });
            });

            // Find the top genre
            const topGenre = Object.keys(genres).reduce((a, b) => (genres[a] > genres[b] ? a : b));
            return { topGenre };
        }
        catch (error)
        {
            console.error("Spotify API error:", error.message);
            throw new HttpException("Spotify API error with top genre", HttpStatus.BAD_REQUEST);
        }
    }

    async getTopGenreFromYouTube(providerToken: string): Promise<any>
    {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&access_token=${providerToken}`;
        try
        {
            const response = await axios.get(url);
            const likedVideos = response.data.items;
            const genre = "Pop";
            return { topGenre: genre };
        }
        catch (error)
        {
            throw new HttpException("YouTube API error", HttpStatus.BAD_REQUEST);
        }
    }

    // Get average song duration
    async getAverageSongDuration(
        accessToken: string,
        refreshToken: string,
        providerName: string
    ): Promise<any>
    {
        await this.setSupabaseSession(accessToken, refreshToken);
        const userId = await this.getUserIdFromAccessToken(accessToken);
        const { providerToken } = await this.supabaseService.retrieveTokens(userId);

        if (providerName === "spotify")
        {
            return this.getAverageSongDurationFromSpotify(providerToken);
        }
        else if (providerName === "youtube")
        {
            return this.getAverageSongDurationFromYouTube(providerToken);
        }

        throw new HttpException("Invalid provider", HttpStatus.BAD_REQUEST);
    }

    async getAverageSongDurationFromSpotify(providerToken: string): Promise<any>
    {
        const url = "https://api.spotify.com/v1/me/player/recently-played";
        try
        {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${providerToken}`
                }
            });
            const tracks = response.data.items;
            let totalDuration = 0;

            tracks.forEach((track) =>
            {
                totalDuration += track.track.duration_ms;
            });

            const averageDuration = totalDuration / tracks.length;
            const minutes = Math.floor(averageDuration / 60000);
            const seconds = Math.floor((averageDuration % 60000) / 1000);
            return { averageDuration: `${minutes}:${seconds < 10 ? "0" : ""}${seconds}` };
        }
        catch (error)
        {
            throw new HttpException("Spotify API error with duration", HttpStatus.BAD_REQUEST);
        }
    }

    async getAverageSongDurationFromYouTube(providerToken: string): Promise<any>
    {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&myRating=like&access_token=${providerToken}`;
        try
        {
            const response = await axios.get(url);
            const likedVideos = response.data.items;
            let totalDuration = 0;

            likedVideos.forEach((video) =>
            {
                const duration = video.contentDetails.duration;
                const time = this.parseYouTubeDuration(duration);
                totalDuration += time;
            });

            const averageDuration = totalDuration / likedVideos.length;
            const minutes = Math.floor(averageDuration / 60);
            const seconds = Math.floor(averageDuration % 60);
            return { averageDuration: `${minutes}:${seconds < 10 ? "0" : ""}${seconds}` };
        }
        catch (error)
        {
            throw new HttpException("YouTube API error", HttpStatus.BAD_REQUEST);
        }
    }

    // Get most active day
    async getMostActiveDay(
        accessToken: string,
        refreshToken: string,
        providerName: string
    ): Promise<any>
    {
        await this.setSupabaseSession(accessToken, refreshToken);
        const userId = await this.getUserIdFromAccessToken(accessToken);
        const { providerToken } = await this.supabaseService.retrieveTokens(userId);

        if (providerName === "spotify")
        {
            return this.getMostActiveDayFromSpotify(providerToken);
        }
        else if (providerName === "youtube")
        {
            return this.getMostActiveDayFromYouTube(providerToken);
        }

        throw new HttpException("Invalid provider", HttpStatus.BAD_REQUEST);
    }

    async getMostActiveDayFromSpotify(providerToken: string): Promise<any>
    {
        const url = "https://api.spotify.com/v1/me/player/recently-played";
        try
        {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${providerToken}`
                }
            });
            const tracks = response.data.items;
            const days = {};

            // Count tracks per day
            tracks.forEach((track) =>
            {
                const date = new Date(track.played_at).toLocaleDateString("en-US", { weekday: "long" });
                days[date] = (days[date] || 0) + 1;
            });

            // Find the day with the most plays
            const mostActiveDay = Object.keys(days).reduce((a, b) => (days[a] > days[b] ? a : b));
            return { mostActiveDay };
        }
        catch (error)
        {
            throw new HttpException("Spotify API error most active day", HttpStatus.BAD_REQUEST);
        }
    }

    async getMostActiveDayFromYouTube(providerToken: string): Promise<any>
    {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&access_token=${providerToken}`;
        try
        {
            const response = await axios.get(url);
            const likedVideos = response.data.items;
            const days = {};

            likedVideos.forEach((video) =>
            {
                const date = new Date(video.snippet.publishedAt).toLocaleDateString("en-US", {
                    weekday: "long"
                });
                days[date] = (days[date] || 0) + 1;
            });

            const mostActiveDay = Object.keys(days).reduce((a, b) => (days[a] > days[b] ? a : b));
            return { mostActiveDay };
        }
        catch (error)
        {
            throw new HttpException("YouTube API error", HttpStatus.BAD_REQUEST);
        }
    }

    // Get unique artists listened
    async getUniqueArtistsListened(
        accessToken: string,
        refreshToken: string,
        providerName: string
    ): Promise<any>
    {
        await this.setSupabaseSession(accessToken, refreshToken);
        const userId = await this.getUserIdFromAccessToken(accessToken);
        const { providerToken } = await this.supabaseService.retrieveTokens(userId);

        if (providerName === "spotify")
        {
            return this.getUniqueArtistsFromSpotify(providerToken);
        }
        else if (providerName === "youtube")
        {
            return this.getUniqueArtistsFromYouTube(providerToken);
        }

        throw new HttpException("Invalid provider", HttpStatus.BAD_REQUEST);
    }

    async getUniqueArtistsFromSpotify(providerToken: string): Promise<any>
    {
        const url = "https://api.spotify.com/v1/me/player/recently-played";
        try
        {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${providerToken}`
                }
            });
            const tracks = response.data.items;
            const uniqueArtists = new Set();

            tracks.forEach((track) =>
            {
                track.track.artists.forEach((artist) => uniqueArtists.add(artist.name));
            });

            return { uniqueArtists: Array.from(uniqueArtists) };
        }
        catch (error)
        {
            throw new HttpException("Spotify API error unique artists", HttpStatus.BAD_REQUEST);
        }
    }

    async getUniqueArtistsFromYouTube(providerToken: string): Promise<any>
    {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&access_token=${providerToken}`;
        try
        {
            const response = await axios.get(url);
            const likedVideos = response.data.items;
            const uniqueChannels = new Set();

            likedVideos.forEach((video) => uniqueChannels.add(video.snippet.channelTitle));

            return { uniqueArtists: Array.from(uniqueChannels) };
        }
        catch (error)
        {
            throw new HttpException("YouTube API error", HttpStatus.BAD_REQUEST);
        }
    }

    private async getUserIdFromAccessToken(accessToken: string): Promise<string>
    {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase.auth.getUser(accessToken);

        if (error || !data || !data.user)
        {
            throw new HttpException("Invalid access token", HttpStatus.UNAUTHORIZED);
        }

        return data.user.id;
    }

    private async setSupabaseSession(accessToken: string, refreshToken: string): Promise<void>
    {
        const supabase = createSupabaseClient();
        const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        });

        if (error)
        {
            console.error("Error setting Supabase session:", error);
            throw new HttpException("Failed to set Supabase session", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getListeningTrends(accessToken: string, refreshToken: string, providerName: string)
    {
        if (providerName === "spotify")
        {
            return await this.getSpotifyListeningTrends(accessToken);
        }
        else if (providerName === "youtube")
        {
            return await this.getYoutubeListeningTrends(accessToken);
        }
        else
        {
            throw new HttpException("Unsupported provider", HttpStatus.BAD_REQUEST);
        }
    }

    // Method to get weekly playlist
    async getWeeklyPlaylist(accessToken: string, refreshToken: string, providerName: string)
    {
        if (providerName === "spotify")
        {
            return await this.getSpotifyWeeklyPlaylist(accessToken);
        }
        else if (providerName === "youtube")
        {
            return await this.getYoutubeWeeklyPlaylist(accessToken);
        }
        else
        {
            throw new HttpException("Unsupported provider", HttpStatus.BAD_REQUEST);
        }
    }

    // Method to get the most listened day
    async getMostListenedDay(accessToken: string, refreshToken: string, providerName: string)
    {
        if (providerName === "spotify")
        {
            return await this.getSpotifyMostListenedDay(accessToken);
        }
        else if (providerName === "youtube")
        {
            return await this.getYoutubeMostListenedDay(accessToken);
        }
        else
        {
            throw new HttpException("Unsupported provider", HttpStatus.BAD_REQUEST);
        }
    }

    // Spotify-specific method to get listening trends
    private async getSpotifyListeningTrends(accessToken: string)
    {
        const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    // YouTube-specific method to get listening trends
    private async getYoutubeListeningTrends(accessToken: string)
    {
        // Replace with the actual endpoint and logic to fetch YouTube trends
        // This is a placeholder example
        const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                part: "snippet,contentDetails",
                chart: "mostPopular",
                regionCode: "US"
            }
        });
        return response.data;
    }

    // Spotify-specific method to get the weekly playlist
    private async getSpotifyWeeklyPlaylist(accessToken: string)
    {
        const response = await axios.get("https://api.spotify.com/v1/me/top/artists", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    // YouTube-specific method to get the weekly playlist
    private async getYoutubeWeeklyPlaylist(accessToken: string)
    {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/playlists", {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                part: "snippet",
                maxResults: 10
            }
        });
        return response.data;
    }

    // Spotify-specific method to get the most listened day
    private async getSpotifyMostListenedDay(accessToken: string)
    {
        const response = await axios.get("https://api.spotify.com/v1/me/top/artists", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }

    // YouTube-specific method to get the most listened day
    private async getYoutubeMostListenedDay(accessToken: string)
    {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                part: "snippet",
                chart: "mostPopular"
            }
        });
        return response.data;
    }

    async getListeningOverTime(accessToken: string, refreshToken: string, providerName: string)
    {
        await this.setSupabaseSession(accessToken, refreshToken);
        const userId = await this.getUserIdFromAccessToken(accessToken);
        const { providerToken } = await this.supabaseService.retrieveTokens(userId);

        if (providerName === "spotify")
        {
            return this.fetchSpotifyListeningOverTime(providerToken);
        }
        else if (providerName === "youtube")
        {
            return this.fetchYouTubeListeningOverTime(providerToken);
        }

        throw new HttpException("Invalid provider name", HttpStatus.BAD_REQUEST);
    }

    // Fetch comparison of distinct artists vs tracks for Spotify or YouTube
    async getArtistsVsTracks(accessToken: string, refreshToken: string, providerName: string)
    {
        await this.setSupabaseSession(accessToken, refreshToken);
        const userId = await this.getUserIdFromAccessToken(accessToken);
        const { providerToken } = await this.supabaseService.retrieveTokens(userId);

        if (!providerToken)
        {
            throw new HttpException("Provider token not found", HttpStatus.UNAUTHORIZED);
        }

        if (providerName === "spotify")
        {
            return this.fetchSpotifyArtistsVsTracks(providerToken);
        }
        else if (providerName === "youtube")
        {
            return this.fetchYouTubeArtistsVsTracks(providerToken);
        }

        throw new HttpException("Invalid provider", HttpStatus.BAD_REQUEST);
    }

    // Fetch recent track genres for Spotify or YouTube
    async getRecentTrackGenres(accessToken: string, refreshToken: string, providerName: string)
    {
        await this.setSupabaseSession(accessToken, refreshToken);
        const userId = await this.getUserIdFromAccessToken(accessToken);
        const { providerToken } = await this.supabaseService.retrieveTokens(userId);

        if (providerName === "spotify")
        {
            return this.fetchSpotifyRecentTrackGenres(providerToken);
        }
        else if (providerName === "youtube")
        {
            return this.fetchYouTubeRecentTrackGenres(providerToken);
        }

        throw new HttpException("Invalid provider name", HttpStatus.BAD_REQUEST);
    }

    private async fetchSpotifyRecentTrackGenres(providerToken: string)
    {
        try
        {
            const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
                headers: { Authorization: `Bearer ${providerToken}` }
            });
            return this.parseRecentTrackGenres(response.data.items);
        }
        catch (error)
        {
            if (error.response && error.response.status === 401)
            {
                throw new HttpException("Unauthorized access to Spotify API", HttpStatus.UNAUTHORIZED);
            }
            throw new HttpException("Spotify API error with recent genres", HttpStatus.BAD_REQUEST);
        }
    }

    private async fetchYouTubeRecentTrackGenres(providerToken: string)
    {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            headers: { Authorization: `Bearer ${providerToken}` },
            params: {
                part: "snippet,contentDetails,statistics",
                myRating: "like"
            }
        });
        return this.parseRecentTrackGenres(response.data.items);
    }

    // Fetch listening over time from YouTube
    private async fetchYouTubeListeningOverTime(providerToken: string)
    {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            headers: { Authorization: `Bearer ${providerToken}` },
            params: {
                part: "snippet,contentDetails,statistics",
                myRating: "like"
            }
        });
        return this.parseListeningOverTime(response.data.items);
    }

    // Fetch distinct artists and tracks from YouTube
    private async fetchYouTubeArtistsVsTracks(providerToken: string)
    {
        const playlistResponse = await axios.get(`https://www.googleapis.com/youtube/v3/playlists`, {
            headers: { Authorization: `Bearer ${providerToken}` },
            params: {
                part: "snippet",
                mine: true
            }
        });
        const trackResponse = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
            headers: { Authorization: `Bearer ${providerToken}` },
            params: {
                part: "snippet",
                playlistId: playlistResponse.data.items[0].id
            }
        });
        return this.parseArtistsVsTracks(playlistResponse.data.items, trackResponse.data.items);
    }

    // Parse listening data over time
    private parseListeningOverTime(data: any)
    {
        if (!data || data.length === 0)
        {
            return {};
        }

        const result = data.reduce((acc: any, item: any) =>
        {
            const date = new Date(item.played_at || item.snippet.publishedAt).toDateString();
            if (!acc[date])
            {
                acc[date] = 1;
            }
            else
            {
                acc[date]++;
            }
            return acc;
        }, {});

        return result;
    }

    // Parse artists vs tracks data
    private parseArtistsVsTracks(artistsData: any, tracksData: any)
    {
        const distinctArtists = new Set();
        const distinctTracks = new Set();

        artistsData.forEach((artist: any) =>
        {
            if (!distinctArtists.has(artist.name))
            {
                distinctArtists.add(artist.name);
            }
        });

        tracksData.forEach((track: any) =>
        {
            distinctTracks.add(track.name);
        });

        return {
            distinctArtists: distinctArtists.size,
            distinctTracks: distinctTracks.size
        };
    }

    // Parse recent track genres data
    private parseRecentTrackGenres(tracksData: any)
    {
        const genres = {};
        tracksData.forEach((track: any) =>
        {
            const genre = track.album?.genres?.[0] || "Unknown";
            if (!genres[genre])
            {
                genres[genre] = 1;
            }
            else
            {
                genres[genre]++;
            }
        });
        return genres;
    }
}