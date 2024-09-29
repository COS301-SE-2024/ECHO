import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { SearchService } from "../services/search.service";

@Controller("search")
export class SearchController
{
    constructor(private readonly searchService: SearchService)
    {
    }

    // This endpoint is used to search for tracks by title.
    @Post("search")
    async searchByTitle(@Body() body: { title: string }): Promise<any>
    {
        const { title } = body;
        return await this.searchService.searchByTitle(title);
    }

    // This endpoint is used to search for albums based on their title.
    @Post("album")
    async searchByAlbum(@Body() body: { title: string }): Promise<any>
    {
        const { title } = body;
        return await this.searchService.searchByAlbum(title);
    }

    // This endpoint is used to get the details of a specific artist.
    @Post("artist")
    async searchForArtist(@Body() body: { artist: string }): Promise<any>
    {
        const { artist } = body;
        return await this.searchService.artistSearch(artist);
    }

    // This endpoint is used to get the details of a specific album.
    @Post("album-info")
    async albumInfo(@Body() body: { title: string }): Promise<any>
    {
        const { title } = body;
        return await this.searchService.searchAlbums(title);
    }

    // This endpoint is used to get songs for a specific mood.
    @Get("mood")
    async getPlaylistByMood(@Query("mood") mood: string): Promise<any>
    {
        return await this.searchService.getPlaylistSongsByMood(mood);
    }

    // This endpoint is used to get suggested moods and their corresponding songs.
    @Get("suggested-moods")
    async getSuggestedMoods(): Promise<any>
    {
        return await this.searchService.getSuggestedMoods();
    }

}
