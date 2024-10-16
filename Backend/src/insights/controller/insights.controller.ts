import { Controller, Get, Query, HttpException, HttpStatus } from "@nestjs/common";
import { InsightsService } from "../services/insights.service";

@Controller("insights")
export class InsightsController
{
    constructor(private readonly insightsService: InsightsService)
    {
    }

    // Endpoint to get the top mood from recent tracks
    @Get("top-mood")
    async getTopMood(
        @Query("userId") userId: string,
        @Query("accessToken") accessToken: string,
        @Query("providerToken") providerToken: string,
        @Query("providerName") providerName: string
    )
    {
        if (!userId || !accessToken || !providerToken || !providerName)
        {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getTopMood(userId, accessToken, providerToken, providerName);
    }

    // Endpoint to get the total listening time
    @Get("total-listening-time")
    async getTotalListeningTime(
        @Query("userId") userId: string,
        @Query("accessToken") accessToken: string,
        @Query("providerToken") providerToken: string,
        @Query("providerName") providerName: string
    )
    {
        if (!userId || !accessToken || !providerToken || !providerName)
        {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getTotalListeningTime(userId, accessToken, providerToken, providerName);
    }

    // Endpoint to get the most listened artist
    @Get("most-listened-artist")
    async getMostListenedArtist(
        @Query("userId") userId: string,
        @Query("accessToken") accessToken: string,
        @Query("providerToken") providerToken: string,
        @Query("providerName") providerName: string
    )
    {
        if (!userId || !accessToken || !providerToken || !providerName)
        {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getMostListenedArtist(userId, accessToken, providerToken, providerName);
    }

    // Endpoint to get the most played track
    @Get("most-played-track")
    async getMostPlayedTrack(
        @Query("userId") userId: string,
        @Query("accessToken") accessToken: string,
        @Query("providerToken") providerToken: string,
        @Query("providerName") providerName: string
    )
    {
        if (!userId || !accessToken || !providerToken || !providerName)
        {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getMostPlayedTrack(userId, accessToken, providerToken, providerName);
    }

    // Endpoint to get the top genre from the user's listening history
    @Get("top-genre")
    async getTopGenre(
        @Query("userId") userId: string,
        @Query("accessToken") accessToken: string,
        @Query("providerToken") providerToken: string,
        @Query("providerName") providerName: string
    )
    {
        if (!userId || !accessToken || !providerToken || !providerName)
        {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getTopGenre(userId, accessToken, providerToken, providerName);
    }

    // Endpoint to get the average song duration
    @Get("average-song-duration")
    async getAverageSongDuration(
        @Query("userId") userId: string,
        @Query("accessToken") accessToken: string,
        @Query("providerToken") providerToken: string,
        @Query("providerName") providerName: string
    )
    {
        if (!userId || !accessToken || !providerToken || !providerName)
        {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getAverageSongDuration(userId, accessToken, providerToken, providerName);
    }

    // Endpoint to get the most active day of listening
    @Get("most-active-day")
    async getMostActiveDay(
        @Query("userId") userId: string,
        @Query("accessToken") accessToken: string,
        @Query("providerToken") providerToken: string,
        @Query("providerName") providerName: string
    )
    {
        if (!userId || !accessToken || !providerToken || !providerName)
        {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getMostActiveDay(userId, accessToken, providerToken, providerName);
    }

    // Endpoint to get the number of unique artists listened to
    @Get("unique-artists-listened")
    async getUniqueArtistsListened(
        @Query("userId") userId: string,
        @Query("accessToken") accessToken: string,
        @Query("providerToken") providerToken: string,
        @Query("providerName") providerName: string
    )
    {
        if (!userId || !accessToken || !providerToken || !providerName)
        {
            throw new HttpException("Missing required parameters", HttpStatus.BAD_REQUEST);
        }
        return this.insightsService.getUniqueArtistsListened(userId, accessToken, providerToken, providerName);
    }
}
