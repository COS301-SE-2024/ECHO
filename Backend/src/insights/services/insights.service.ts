import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import axios from "axios";
import { createSupabaseClient } from "../../supabase/services/supabaseClient";

@Injectable()
export class InsightsService
{

    // Helper to get user details from Supabase
    private async getUserFromSupabase(accessToken: string)
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
        userId: string,
        accessToken: string,
        providerToken: string,
        providerName: string
    ): Promise<any>
    {
        const user = await this.getUserFromSupabase(accessToken);
        if (!user || user.id !== userId)
        {
            throw new HttpException("User not authorized", HttpStatus.UNAUTHORIZED);
        }

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

    // Get total listening time from Spotify or YouTube
    async getTotalListeningTime(
        userId: string,
        accessToken: string,
        providerToken: string,
        providerName: string
    ): Promise<any>
    {
        const user = await this.getUserFromSupabase(accessToken);
        if (!user || user.id !== userId)
        {
            throw new HttpException("User not authorized", HttpStatus.UNAUTHORIZED);
        }

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

    // Get most played track for a user
    async getMostPlayedTrack(
        userId: string,
        accessToken: string,
        providerToken: string,
        providerName: string
    ): Promise<any>
    {
        const user = await this.getUserFromSupabase(accessToken);
        if (!user || user.id !== userId)
        {
            throw new HttpException("User not authorized", HttpStatus.UNAUTHORIZED);
        }

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

    // Get most listened artist for a user
    async getMostListenedArtist(
        userId: string,
        accessToken: string,
        providerToken: string,
        providerName: string
    ): Promise<any>
    {
        const user = await this.getUserFromSupabase(accessToken);
        if (!user || user.id !== userId)
        {
            throw new HttpException("User not authorized", HttpStatus.UNAUTHORIZED);
        }

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


    async getTopMoodFromSpotify(providerToken: string): Promise<any>
    {
        const url = "https://api.spotify.com/v1/me/top/tracks";
        try
        {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${providerToken}`
                }
            });
            const topTracks = response.data.items;
            const mood = "Happy";
            return { mood };
        }
        catch (error)
        {
            throw new HttpException("Spotify API error", HttpStatus.BAD_REQUEST);
        }
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
            throw new HttpException("Spotify API error", HttpStatus.BAD_REQUEST);
        }
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
            throw new HttpException("Spotify API error", HttpStatus.BAD_REQUEST);
        }
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
            throw new HttpException("Spotify API error", HttpStatus.BAD_REQUEST);
        }
    }

    // --- YouTube-specific methods ---

    async getTopMoodFromYouTube(providerToken: string): Promise<any>
    {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&access_token=${providerToken}`;
        try
        {
            const response = await axios.get(url);
            const likedVideos = response.data.items;
            const mood = "Energetic"; // Simplified mood analysis logic
            return { mood };
        }
        catch (error)
        {
            throw new HttpException("YouTube API error", HttpStatus.BAD_REQUEST);
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
    async getTopGenre(
        userId: string,
        accessToken: string,
        providerToken: string,
        providerName: string
    ): Promise<any>
    {
        const user = await this.getUserFromSupabase(accessToken);
        if (!user || user.id !== userId)
        {
            throw new HttpException("User not authorized", HttpStatus.UNAUTHORIZED);
        }

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
        const url = "https://api.spotify.com/v1/me/top/tracks";
        try
        {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${providerToken}`
                }
            });
            const topTracks = response.data.items;
            const genres = {};

            // Accumulate genres from artists
            topTracks.forEach((track) =>
            {
                track.artists.forEach((artist) =>
                {
                    artist.genres.forEach((genre) =>
                    {
                        if (!genres[genre])
                        {
                            genres[genre] = 0;
                        }
                        genres[genre]++;
                    });
                });
            });

            // Find the top genre
            const topGenre = Object.keys(genres).reduce((a, b) => (genres[a] > genres[b] ? a : b));
            return { topGenre };
        }
        catch (error)
        {
            throw new HttpException("Spotify API error", HttpStatus.BAD_REQUEST);
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
        userId: string,
        accessToken: string,
        providerToken: string,
        providerName: string
    ): Promise<any>
    {
        const user = await this.getUserFromSupabase(accessToken);
        if (!user || user.id !== userId)
        {
            throw new HttpException("User not authorized", HttpStatus.UNAUTHORIZED);
        }

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
            throw new HttpException("Spotify API error", HttpStatus.BAD_REQUEST);
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
            const seconds = Math.floor((averageDuration % 60000) / 1000);
            return { averageDuration: `${minutes}:${seconds < 10 ? "0" : ""}${seconds}` };
        }
        catch (error)
        {
            throw new HttpException("YouTube API error", HttpStatus.BAD_REQUEST);
        }
    }

    // Get most active day
    async getMostActiveDay(
        userId: string,
        accessToken: string,
        providerToken: string,
        providerName: string
    ): Promise<any>
    {
        const user = await this.getUserFromSupabase(accessToken);
        if (!user || user.id !== userId)
        {
            throw new HttpException("User not authorized", HttpStatus.UNAUTHORIZED);
        }

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
            throw new HttpException("Spotify API error", HttpStatus.BAD_REQUEST);
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

            // Count videos per day
            likedVideos.forEach((video) =>
            {
                const date = new Date(video.snippet.publishedAt).toLocaleDateString("en-US", { weekday: "long" });
                days[date] = (days[date] || 0) + 1;
            });

            // Find the day with the most plays
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
        userId: string,
        accessToken: string,
        providerToken: string,
        providerName: string
    ): Promise<any>
    {
        const user = await this.getUserFromSupabase(accessToken);
        if (!user || user.id !== userId)
        {
            throw new HttpException("User not authorized", HttpStatus.UNAUTHORIZED);
        }

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
            throw new HttpException("Spotify API error", HttpStatus.BAD_REQUEST);
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

}
