import { Test, TestingModule } from '@nestjs/testing';
import { SearchModule } from './search.module';
import { SearchService } from './services/search.service';
import { SearchController } from './controller/search.controller';
import { HttpModule } from '@nestjs/axios';

describe('SearchModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [SearchModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import HttpModule', () => {
    const httpModule = module.get(HttpModule);
    expect(httpModule).toBeDefined();
  });

  it('should provide SearchService', () => {
    const searchService = module.get(SearchService);
    expect(searchService).toBeDefined();
  });

  it('should have SearchController', () => {
    const searchController = module.get(SearchController);
    expect(searchController).toBeDefined();
  });
});
