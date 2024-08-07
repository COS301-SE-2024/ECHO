import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeModule } from './youtube.module';
import { YoutubeService } from './services/youtube.service';
import { YoutubeController } from './controller/youtube.controller';
import { HttpModule } from '@nestjs/axios';
import { SupabaseModule } from '../supabase/supabase.module';

describe('YoutubeModule', () => {
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [HttpModule, SupabaseModule, YoutubeModule],
    }).compile();
  });

  it('should be defined', () => {
    const youtubeModule = testingModule.get<YoutubeModule>(YoutubeModule);
    expect(youtubeModule).toBeDefined();
  });

  it('should have YoutubeService as a provider', () => {
    const youtubeService = testingModule.get<YoutubeService>(YoutubeService);
    expect(youtubeService).toBeDefined();
  });

  it('should have YoutubeController as a controller', () => {
    const youtubeController = testingModule.get<YoutubeController>(YoutubeController);
    expect(youtubeController).toBeDefined();
  });

  it('should import HttpModule', () => {
    const httpModule = testingModule.get(HttpModule);
    expect(httpModule).toBeDefined();
  });

  it('should import SupabaseModule', () => {
    const supabaseModule = testingModule.get(SupabaseModule);
    expect(supabaseModule).toBeDefined();
  });
});
