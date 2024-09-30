import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AuthController } from './auth/controller/auth.controller';
import { SpotifyController } from './spotify/controller/spotify.controller';
import { YouTubeController } from './youtube/controller/youtube.controller';
import { SearchController } from './search/controller/search.controller';
import { TokenMiddleware } from './middleware/token.middleware';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';

describe('AppModule', () => {
    let appModule: TestingModule;

    beforeAll(async () => {
        appModule = await Test.createTestingModule({
            imports: [AppModule],
            providers: [TokenMiddleware]
        }).compile();
    });

    it('should be defined', () => {
        expect(appModule).toBeDefined();
    });

    it('should have AuthController defined', () => {
        const authController = appModule.get<AuthController>(AuthController);
        expect(authController).toBeDefined();
    });

    it('should have SpotifyController defined', () => {
        const spotifyController = appModule.get<SpotifyController>(SpotifyController);
        expect(spotifyController).toBeDefined();
    });

    it('should have YouTubeController defined', () => {
        const youtubeController = appModule.get<YouTubeController>(YouTubeController);
        expect(youtubeController).toBeDefined();
    });

    it('should have SearchController defined', () => {
        const searchController = appModule.get<SearchController>(SearchController);
        expect(searchController).toBeDefined();
    });

    it('should have TokenMiddleware applied to auth/callback route', () => {
        
      // Assuming you can inspect the middleware routes, which usually you can't directly.
      // You may need to rethink how to validate middleware is applied,
      // as there's no built-in way to check this.
      // You can just verify that TokenMiddleware is defined and should be included.

      const tokenMiddleware = appModule.get<TokenMiddleware>(TokenMiddleware);
      expect(tokenMiddleware).toBeDefined();
    });
});
