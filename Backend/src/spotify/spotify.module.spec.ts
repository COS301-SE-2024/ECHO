import { Test, TestingModule } from "@nestjs/testing";
import { SpotifyModule } from "./spotify.module";
import { SpotifyService } from "./services/spotify.service";
import { SpotifyController } from "./controller/spotify.controller";
import { SupabaseService } from "../supabase/services/supabase.service";
import { HttpModule, HttpService } from "@nestjs/axios";

describe("SpotifyModule", () => {
    let spotifyService: SpotifyService;
    let supabaseService: SupabaseService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [SpotifyModule],
            providers: [SpotifyService,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(() => {
                            return "Hello";
                        }),
                    }
                },
                {
                    provide: SupabaseService,
                    useValue: {
                        get: jest.fn(() => {
                            return "Hello";
                        }),
                    }
                }
            ],
        }).compile();

        spotifyService = module.get<SpotifyService>(SpotifyService);
        supabaseService = module.get<SupabaseService>(SupabaseService);
    });

    it("should compile the module", () => {
        expect(module).toBeDefined();
    });

    it("should provide SpotifyService", () => {
        expect(spotifyService).toBeDefined();
    });

    it("should provide SupabaseService", () => {
        expect(supabaseService).toBeDefined();
    });
});