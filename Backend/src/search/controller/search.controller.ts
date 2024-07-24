import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { SearchService } from "../services/search.service";

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Post('search')
    async searchByTitle(@Body() body: { title: string }): Promise<any> {
        const {title} = body;
        return await this.searchService.searchByTitle(title);
    }

    @Post('album')
    async searchByAlbum(@Body() body: { title: string }): Promise<any> {
        const {title} = body;
        return await this.searchService.searchByAlbum(title);
    }


}
