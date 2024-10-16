import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    getHello(): string {
        return this.appService.getHello();
    }

    @Get('/health')
    healthCheck() {
        return 'OK';
    }
}
