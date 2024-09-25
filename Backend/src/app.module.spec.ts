import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth/controller/auth.controller';
import { SpotifyController } from './spotify/controller/spotify.controller';
import { YoutubeController } from './youtube/controller/youtube.controller';
import { SearchController } from './search/controller/search.controller';
import { AuthService } from './auth/services/auth.service';
import { SupabaseService } from './supabase/services/supabase.service';
import { ConfigService } from '@nestjs/config';
import { SpotifyService } from './spotify/services/spotify.service';
import { YoutubeService } from './youtube/services/youtube.service';
import { SearchService } from './search/services/search.service';
import { TokenMiddleware } from './middleware/token.middleware';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should import ConfigModule and HttpModule', () => {
    const imports = module.get(AppModule).constructor.prototype.constructor.parameters;

    expect(imports).toContainEqual(expect.arrayContaining([ConfigModule]));
    expect(imports).toContainEqual(expect.arrayContaining([HttpModule]));
  });

  it('should have the correct controllers', () => {
    const controllers = module.get(AppModule).constructor.prototype.controllers;
    expect(controllers).toContainEqual(AuthController);
    expect(controllers).toContainEqual(SpotifyController);
    expect(controllers).toContainEqual(YoutubeController);
    expect(controllers).toContainEqual(SearchController);
  });

  it('should have the correct providers', () => {
    const providers = module.get(AppModule).constructor.prototype.providers;
    expect(providers).toContainEqual(expect.anything());
    expect(providers).toContainEqual(AuthService);
    expect(providers).toContainEqual(SupabaseService);
    expect(providers).toContainEqual(ConfigService);
    expect(providers).toContainEqual(SpotifyService);
    expect(providers).toContainEqual(YoutubeService);
    expect(providers).toContainEqual(SearchService);
  });

  it('should apply TokenMiddleware to auth/callback route', () => {
    const consumer = {
      apply: jest.fn().mockReturnThis(),
      forRoutes: jest.fn().mockReturnValue({ path: 'auth/callback', method: RequestMethod.GET }),
    } as unknown as MiddlewareConsumer;

    const appModule = new AppModule();
    appModule.configure(consumer);

    expect(consumer.apply).toHaveBeenCalledWith(TokenMiddleware);
    expect(consumer.apply(TokenMiddleware).forRoutes).toHaveBeenCalledWith({ path: 'auth/callback', method: RequestMethod.GET });
  });
});
