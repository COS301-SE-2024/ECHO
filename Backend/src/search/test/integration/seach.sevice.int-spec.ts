import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from '../../services/search.service'; // adjust path as necessary
import { SearchController } from '../../controller/search.controller'; // adjust path as necessary
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('SearchController Integration Test', () => {
    let app: INestApplication;
    let service: SearchService;

    const mockApiResponse = { 
        data: { 
            data: [
                { 
                    id: 1, 
                    title: 'Test Song',
                    album: {
                        title: 'testName',
                        cover_big: 'eh'
                    },
                    artist: {
                        name: 'eh'
                    }
                } 
            ] 
        } 
    };

    const mockHttpService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SearchController],
            providers: [
                SearchService, // Include the actual service here
                {
                    provide: HttpService,
                    useValue: mockHttpService,
                },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
        
        service = module.get<SearchService>(SearchService);
    });

    afterEach(async () => {
        jest.clearAllMocks(); // Clear mocks after each test
        await app.close(); // Close the application after each test
    });

    it('should return songs when searchByTitle is called', async () => {
        const title = 'Test Title';

        // Mock the HTTP service response
        mockHttpService.get.mockReturnValue(of(mockApiResponse));

        // Call the controller endpoint
        const response = await request(app.getHttpServer())
            .post(`/search/search`) // Adjust the URL based on your route setup
            .send({ title }); // Assuming you're using query parameters

        let expectedServiceResponse = [{
            "albumImageUrl": "eh", 
            "albumName": "testName", 
            "artistName": "eh", 
            "name": "Test Song"
        }];

        // Expect the result to match the mock response
        expect(response.status).toBe(201);
        expect(response.body).toEqual(expectedServiceResponse);
        
        // Optional: Check that the HTTP service's get method was called with the correct URL
        expect(mockHttpService.get).toHaveBeenCalledWith(`${service['deezerApiUrl']}/search?q=${title}`);
    });
});
