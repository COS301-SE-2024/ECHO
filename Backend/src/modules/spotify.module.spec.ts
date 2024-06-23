import { Test, TestingModule } from "@nestjs/testing";
import { SpotifyModule } from "./spotify.module";
import { SpotifyService } from "../services/spotify.service";
import { SpotifyController } from "../controllers/spotify.controller";

describe("AuthModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [SpotifyModule],
        }).compile();
    });

    it("should compile the module", () => {
        expect(module).toBeDefined();
    });

    it("should provide AuthService", () => {
        const authService = module.get<SpotifyService>(SpotifyService);
        expect(authService).toBeDefined();
    });

    it("should provide AuthController", () => {
        const authController = module.get<SpotifyController>(SpotifyController);
        expect(authController).toBeDefined();
    });
});