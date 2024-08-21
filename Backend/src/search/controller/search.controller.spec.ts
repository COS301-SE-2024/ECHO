import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from '../services/search.service';
import { NotFoundException } from '@nestjs/common';

interface ArtistInfo
{
	name: string;
	image: string;
	topTracks: Track[];
	albums: Album[];
}

interface AlbumInfo extends Album
{
	releaseDate: string;
	tracks: AlbumTrack[];
}

interface AlbumTrack
{
	id: number;
	name: string;
	duration: number;
	trackNumber: number;
	artistName: string;
}

interface Track
{
	name: string;
	albumName: string;
	albumImageUrl: string;
	artistName: string;
}

interface Album
{
	id: number;
	name: string;
	imageUrl: string;
	artistName: string;
}

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
            artistSearch: jest.fn(),
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

  describe('searchForArtist', () => {
    it('should call searchService.artistSearch with the correct artist name', async () => {
      const artistName = 'Artist Name';
      const searchResult : ArtistInfo = { 
        name: 'Artist Name', 
        image: 'image',
        topTracks: [
          {
            name: 'name',
            albumName: 'name',
            albumImageUrl: 'url',
            artistName: 'name',
          }
        ],
        albums: []
      };

      jest.spyOn(searchService, 'artistSearch').mockResolvedValue(searchResult);

      const result = await searchController.searchForArtist({ artist: artistName });

      expect(searchService.artistSearch).toHaveBeenCalledWith(artistName);
      expect(result).toEqual(searchResult);
    });

    it('should handle errors thrown by searchService.artistSearch', async () => {
      const artistName = 'Artist Name';
      const error = new Error('Something went wrong');

      jest.spyOn(searchService, 'artistSearch').mockRejectedValue(error);

      await expect(searchController.searchForArtist({ artist: artistName })).rejects.toThrow(error);
    });
  });

  describe('albumInfo', () => {
    it('should return album info when the searchService returns data', async () => {
      const title = 'Test Album';
      const albumData : AlbumInfo = { 
        id: 1,
        name: "names",
        imageUrl: 'coolpics',
        artistName: 'coolname',
        releaseDate: 'mock release date', 
        tracks: [
          {
            id: 2,
            name: "guh",
            duration: 6,
            trackNumber: 5,
            artistName: 'guhguh'
          },
        ]};
    
      jest.spyOn(searchService, 'searchAlbums').mockResolvedValue(albumData);
    
      const result = await searchController.albumInfo({ title });
    
      expect(searchService.searchAlbums).toHaveBeenCalledWith(title);
      expect(result).toEqual(albumData);
    });
    
    it('should handle cases where no album data is found', async () => {
      const title = 'Nonexistent Album';
    
      jest.spyOn(searchService, 'searchAlbums').mockResolvedValue(null);
    
      const result = await searchController.albumInfo({ title });
    
      expect(searchService.searchAlbums).toHaveBeenCalledWith(title);
      expect(result).toBeNull();
    });

    it('should throw an error if searchService.searchAlbums throws an exception', async () => {
      const title = 'Test Album';
    
      jest.spyOn(searchService, 'searchAlbums').mockRejectedValue(new NotFoundException());
    
      await expect(searchController.albumInfo({ title })).rejects.toThrow(NotFoundException);
      expect(searchService.searchAlbums).toHaveBeenCalledWith(title);
    });
    
    
  });
});
