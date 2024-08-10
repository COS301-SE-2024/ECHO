import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { SearchService } from "../services/search.service";

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    // This endpoint is used to search for tracks by title.
    @Post('search')
    async searchByTitle(@Body() body: { title: string }): Promise<any> {
        const {title} = body;
        return await this.searchService.searchByTitle(title);
    }

    // This endpoint is used to get the details of a specific album.
    @Post('album')
    async searchByAlbum(@Body() body: { title: string }): Promise<any> {
        const {title} = body;
        return await this.searchService.searchByAlbum(title);
    }

    // This endpoint is used to get the details of a specific album.
    @Post('artist')
    async searchForArtist(@Body() body: { artist: string }): Promise<any> {
        const {artist} = body;
        return await this.searchService.artistSearch(artist);
    }


}
