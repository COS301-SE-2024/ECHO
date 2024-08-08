import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from '../services/search.service';

describe('SearchController', () => {
  let searchController: SearchController;
  let searchService: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: {
            searchByTitle: jest.fn(),
            searchByAlbum: jest.fn(),
          },
        },
      ],
    }).compile();

    searchController = module.get<SearchController>(SearchController);
    searchService = module.get<SearchService>(SearchService);
  });

  describe('searchByTitle', () => {
    it('should call searchService.searchByTitle with the correct parameter', async () => {
      const title = 'test title';
      const searchResult = { data: 'test result' };
      (searchService.searchByTitle as jest.Mock).mockResolvedValue(searchResult);

      const result = await searchController.searchByTitle({ title });

      expect(searchService.searchByTitle).toHaveBeenCalledWith(title);
      expect(result).toEqual(searchResult);
    });
  });

  describe('searchByAlbum', () => {
    it('should call searchService.searchByAlbum with the correct parameter', async () => {
      const title = 'test album';
      const searchResult = { data: 'test result' };
      (searchService.searchByAlbum as jest.Mock).mockResolvedValue(searchResult);

      const result = await searchController.searchByAlbum({ title });

      expect(searchService.searchByAlbum).toHaveBeenCalledWith(title);
      expect(result).toEqual(searchResult);
    });
  });
});
